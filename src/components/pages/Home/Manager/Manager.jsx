import { memo, useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSnackbar } from 'redux/features/app/appSlice';
import { updateDocuments } from 'redux/features/user/userSlice';
import { db } from 'firebase.js';
import { doc, setDoc } from 'firebase/firestore';

import { FolderNavigation } from './FolderNavigation/FolderNavigation';
import { Folders } from './Folders/Folders';
import { Notes } from './Notes/Notes';
import { Tasks } from './Tasks/Tasks';

import css from './Manager.module.css';

import { findFolder } from 'utils/findFolder';

export const Manager = memo(function MemoizedComponent() {
  const dispatch = useDispatch();

  const { userId, documents, path } = useSelector(state => state.user);

  const managerRef = useRef(null);

  const [folder, setFolder] = useState(null);
  const [isDraggable, setIsDraggable] = useState(false);
  const [draggableOffsetX, setDraggableOffsetX] = useState(null);
  const [draggableOffsetY, setDraggableOffsetY] = useState(null);
  const [draggableIndex, setDraggableIndex] = useState(null);
  const [draggableId, setDraggableId] = useState(null);
  const [draggableType, setDraggableType] = useState(null);
  const [targetIndex, setTargetIndex] = useState(null);
  const [targetId, setTargetId] = useState(null);
  const [targetType, setTargetType] = useState(null);
  const [placeholderId, setPlaceholderId] = useState(null);
  const [placeholderPosition, setPlaceholderPosition] = useState(null);
  const [isAllowScroll, setIsAllowScroll] = useState(false);
  const [isAllowNest, setIsAllowNest] = useState(true);
  const [nestFolderId, setNestFolderId] = useState(null);
  const [timerIdDrag, setTimerIdDrag] = useState(null);
  const [timerIdSettings, setTimerIdSettings] = useState(null);
  const [timerIdNest, setTimerIdNest] = useState(null);
  const [timerIdScroll, setTimerIdScroll] = useState(null);

  useEffect(() => {
    function findFolder(object, id) {
      if (object?.id === id) {
        return object;
      } else if (object?.folders && object?.folders.length > 0) {
        for (let i = 0; i < object?.folders.length; i++) {
          const result = findFolder(object?.folders[i], id);

          if (result) {
            return result;
          }
        }
      }

      const managerElement = document.getElementById('manager');
      managerElement.scrollTo(0, 0);

      return null;
    }

    let res = findFolder(documents, path[path.length - 1]);
    setFolder(res);
  }, [documents, path]);

  useEffect(() => {
    const managerElement = document.getElementById('manager');

    if (isAllowScroll === 'bottom') {
      const isScrolling = setInterval(function () {
        managerElement.scrollTop += 4;
      }, 10);
      setTimerIdScroll(isScrolling);
    }
    else if (isAllowScroll === 'top') {
      const isScrolling = setInterval(function () {
        managerElement.scrollTop -= 4;
      }, 10);
      setTimerIdScroll(isScrolling);
    }
    else if (!isAllowScroll) {
      clearInterval(timerIdScroll);
      setTimerIdScroll(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAllowScroll]);

  const touchStartFolder = (e, index, type, currentElement, offsetX, offsetY, folders) => {
    // STEP 1: Set styles
    currentElement.style.position = 'absolute';
    currentElement.style.left = `${e.touches[0].clientX - offsetX}px`;
    currentElement.style.top = `${e.touches[0].clientY - offsetY}px`;
    currentElement.style.padding = '16px';
    currentElement.style.backgroundColor = 'transparent';
    currentElement.style.opacity = 0.5;

    // STEP 2: Set placeholder
    if (folders.length === 1) {
      document.getElementById(type).style.paddingBottom = currentElement.offsetHeight + 'px';
    }
    else {
      if (index === 0) {
        const nextElementId = folders[index + 1].id;
        document.getElementById(nextElementId).style.marginLeft = '50%';
        setPlaceholderId(nextElementId);
      }
      else if (index === folders.length - 1) {
        if (index % 2 === 0) {
          document.getElementById(type).style.paddingBottom = currentElement.offsetHeight + 'px';
        }
        else if (index % 2 !== 0) {
          const prevElementId = folders[folders.length - 2].id;
          document.getElementById(prevElementId).style.marginRight = '50%';
          setPlaceholderId(prevElementId);
        }
      }
      else {
        if (index % 2 === 0) {
          const nextElement = folders[index + 1].id;
          document.getElementById(nextElement).style.marginLeft = '50%';
          setPlaceholderId(nextElement);
        }
        else if (index % 2 !== 0) {
          const prevElementId = folders[index - 1].id;
          document.getElementById(prevElementId).style.marginRight = '50%';
          setPlaceholderId(prevElementId);
        }
      }
    }
  };

  const touchStartUniversal = (e, index, type, currentElement, offsetX, offsetY, contentArray) => {
    const currentElementHeight = currentElement.offsetHeight + 'px';

    // STEP 1: Define styles
    currentElement.style.position = 'absolute';
    currentElement.style.left = `${e.touches[0].clientX - offsetX}px`;
    currentElement.style.top = `${e.touches[0].clientY - offsetY}px`;
    currentElement.style.width = '100%';
    currentElement.style.backgroundColor = '#EEEEEE';
    currentElement.style.opacity = 0.5;

    // STEP 2: Set placeholder
    if (contentArray.length === 1) {
      document.getElementById(type).style.paddingBottom = currentElementHeight;
    }
    else {
      if (index === 0) {
        const nextElementId = contentArray[index + 1].id;
        document.getElementById(nextElementId).style.marginTop = currentElementHeight;
        setPlaceholderId(nextElementId);
      }
      else if (index === contentArray.length - 1) {
        const prevElementId = contentArray[contentArray.length - 2].id;
        document.getElementById(prevElementId).style.marginBottom = currentElementHeight;
        setPlaceholderId(prevElementId);
      }
      else {
        const nextElementId = contentArray[index + 1].id;
        document.getElementById(nextElementId).style.marginTop = currentElementHeight;
        setPlaceholderId(nextElementId);
      }
    }
  };

  const touchStartOpenModal = (e, index, id, name, type, openSettingsModal, currentElement, contentArray) => {
    const timerOpenModal = setTimeout(() => {
      setIsDraggable(false);

      // STEP 1: Reset styles
      currentElement.style.position = 'initial';
      currentElement.style.left = 'initial';
      currentElement.style.top = 'initial';
      currentElement.style.padding = '0px';
      currentElement.style.backgroundColor = 'initial';
      currentElement.style.opacity = 1;

      // STEP 2: Reset placeholder
      if (contentArray.length === 1) {
        document.getElementById(type).style.paddingBottom = '0px';
      }
      else {
        if (type === 'folder') {
          if (index === 0) {
            document.getElementById(contentArray[index + 1].id).style.marginLeft = '0px';
          }
          else if (index === contentArray.length - 1) {
            if (index % 2 === 0) {
              document.getElementById(type).style.paddingBottom = '0px';
            }
            else if (index % 2 !== 0) {
              document.getElementById(contentArray[contentArray.length - 2].id).style.marginRight = '0px';
            }
          }
          else {
            if (index % 2 === 0) {
              document.getElementById(contentArray[index + 1].id).style.marginLeft = '0px';
            }
            else if (index % 2 !== 0) {
              document.getElementById(contentArray[index - 1].id).style.marginRight = '0px';
            }
          }
        }
        else {
          if (index === contentArray.length - 1) {
            const prevElementId = contentArray[contentArray.length - 2].id;
            document.getElementById(prevElementId).style.marginBottom = '0px';
          }
          else {
            const nextElementId = contentArray[index + 1].id;
            document.getElementById(nextElementId).style.marginTop = '0px';
          }
        }
      }

      // STEP 3: Open settings modal
      openSettingsModal(e, id, name);
    }, 500);

    setTimerIdSettings(timerOpenModal);
  };

  const handleTouchStart = (e, index, id, name, type, openSettingsModal) => {
    // STEP 1: Get current element + set touch effect
    const currentElement = e.currentTarget;
    currentElement.classList.add(css.touch);

    // STEP 2: Run timer for Drag And Drop (clear timer on touch move)
    const timerDrag = setTimeout(() => {
      // STEP 3: Set isDraggable and draggable data
      setIsDraggable(true);
      setDraggableIndex(index);
      setDraggableId(id);
      setDraggableType(type);

      // STEP 4: Set element offsets to sycn with pointer move
      const offsetX = e.touches[0].clientX - currentElement.getBoundingClientRect().left;
      const offsetY = e.touches[0].clientY - currentElement.getBoundingClientRect().top;
      setDraggableOffsetX(offsetX);
      setDraggableOffsetY(offsetY);

      // Prevent draggable lagging on touch if move down
      managerRef.current.scrollTop += 1;

      // STEP 5: Define draggable type to set placeholder
      if (type === 'folder') {
        touchStartFolder(e, index, type, currentElement, offsetX, offsetY, folder[`${type}s`]);
      }
      else {
        touchStartUniversal(e, index, type, currentElement, offsetX, offsetY, folder[`${type}s`]);
      }

      // STEP 6: Run timer for modal function
      if (type !== 'task') touchStartOpenModal(e, index, id, name, type, openSettingsModal, currentElement, folder[`${type}s`]);
    }, 200);
    setTimerIdDrag(timerDrag);
  };





  const touchEndDropInFolder = async () => {
    setPlaceholderId(null);

    try {
      const documentsCopy = JSON.parse(JSON.stringify(documents));

      const removeDraggable = targetFolder => {
        // Move draggable into target fodler
        targetFolder.folders[targetIndex][`${draggableType}s`].push(folder[`${draggableType}s`][draggableIndex]);
        // Delete draggable from current place
        targetFolder[`${draggableType}s`].splice(draggableIndex, 1);
      };
      findFolder(documentsCopy, path[path.length - 1], removeDraggable);

      dispatch(updateDocuments(documentsCopy));

      await setDoc(doc(db, 'users', userId), { documents: documentsCopy }, { merge: true });

      dispatch(setSnackbar('Changes were applied'));
    } catch (error) {
      dispatch(setSnackbar('Something went wrong'));
    }
  };

  const touchEndDropFromFolder = async () => {
    setPlaceholderId(null);

    try {
      const documentsCopy = JSON.parse(JSON.stringify(documents));
      const draggableArrayCopy = JSON.parse(JSON.stringify(folder[`${draggableType}s`]));
      const draggableObject = draggableArrayCopy[draggableIndex];
      draggableArrayCopy.splice(draggableIndex, 1);

      const removeDraggable = targetFolder => targetFolder[`${draggableType}s`] = draggableArrayCopy;
      findFolder(documentsCopy, path[path.length - 1], removeDraggable);

      const moveDraggableOutside = (targetFolder) => targetFolder[`${draggableType}s`].push(draggableObject);
      findFolder(documentsCopy, path[path.length - 2], moveDraggableOutside);

      dispatch(updateDocuments(documentsCopy));

      await setDoc(doc(db, 'users', userId), { documents: documentsCopy }, { merge: true });

      dispatch(setSnackbar('Changes were applied'));
    } catch (error) {
      dispatch(setSnackbar('Something went wrong'));
    }
  };

  const touchEndDropFolder = async () => {
    try {
      const newDocuments = JSON.parse(JSON.stringify(documents));

      if (draggableIndex < targetIndex) {
        const foldersCopy = folder.folders;
        const draggableFolder = foldersCopy[draggableIndex];
        const targetFolder = foldersCopy[targetIndex];

        const beforeDraggable = foldersCopy.slice(0, draggableIndex);
        const elementsBetween = foldersCopy.slice(Number(draggableIndex) + 1, targetIndex);
        const afterTarget = foldersCopy.slice(Number(targetIndex) + 1);

        let newFolders;

        if (targetIndex % 2 === 0) {
          if (placeholderPosition === 'left') {
            newFolders = [
              ...beforeDraggable,
              ...elementsBetween,
              targetFolder,
              draggableFolder,
              ...afterTarget
            ];
          }
          else if (placeholderPosition === 'right') {
            newFolders = [
              ...beforeDraggable,
              ...elementsBetween,
              draggableFolder,
              targetFolder,
              ...afterTarget
            ];
          }
        }
        else if (targetIndex % 2 !== 0) {
          if (placeholderPosition === 'left') {
            newFolders = [
              ...beforeDraggable,
              ...elementsBetween,
              draggableFolder,
              targetFolder,
              ...afterTarget
            ];
          }
          else if (placeholderPosition === 'right') {
            newFolders = [
              ...beforeDraggable,
              ...elementsBetween,
              targetFolder,
              draggableFolder,
              ...afterTarget
            ];
          }
        }


        const changeFolderPosition = (targetFolder) => targetFolder.folders = newFolders;
        findFolder(newDocuments, path[path.length - 1], changeFolderPosition);
      }
      else {
        const foldersCopy = folder.folders;
        const draggableFolder = foldersCopy[draggableIndex];
        const targetFolder = foldersCopy[targetIndex];

        const afterDraggable = foldersCopy.slice(Number(draggableIndex) + 1);
        const elementsBetween = foldersCopy.slice(Number(targetIndex) + 1, draggableIndex);
        const beforeTarget = foldersCopy.slice(0, targetIndex);

        let newFolders;

        if (targetIndex % 2 === 0) {
          if (placeholderPosition === 'left') {
            newFolders = [
              ...beforeTarget,
              draggableFolder,
              targetFolder,
              ...elementsBetween,
              ...afterDraggable
            ];
          }
          else if (placeholderPosition === 'right') {
            newFolders = [
              ...beforeTarget,
              targetFolder,
              draggableFolder,
              ...elementsBetween,
              ...afterDraggable
            ];
          }
        }
        else if (targetIndex % 2 !== 0) {
          if (placeholderPosition === 'left') {
            newFolders = [
              ...beforeTarget,
              targetFolder,
              draggableFolder,
              ...elementsBetween,
              ...afterDraggable
            ];
          }
          else if (placeholderPosition === 'right') {
            newFolders = [
              ...beforeTarget,
              draggableFolder,
              targetFolder,
              ...elementsBetween,
              ...afterDraggable
            ];
          }
        }

        const changeFolderPosition = (targetFolder) => targetFolder.folders = newFolders;
        findFolder(newDocuments, path[path.length - 1], changeFolderPosition);
      }

      dispatch(updateDocuments(newDocuments));

      await setDoc(doc(db, 'users', userId), { documents: newDocuments }, { merge: true });

      dispatch(setSnackbar('Changes were applied'));
    } catch (error) {
      dispatch(setSnackbar('Something went wrong'));
    }
  };

  const handleTouchEnd = async e => {
    const currentElement = e.currentTarget;
    currentElement.classList.remove(css.touch);

    clearTimeout(timerIdDrag);
    clearTimeout(timerIdSettings);
    clearTimeout(timerIdNest);
    setIsAllowNest(true);
    setIsAllowScroll(false);

    if (isDraggable) {
      currentElement.style.position = 'initial';
      currentElement.style.left = 'initial';
      currentElement.style.top = 'initial';
      currentElement.style.padding = '0px';
      currentElement.style.backgroundColor = 'initial';
      currentElement.style.opacity = 1;


      setIsDraggable(false);
      setDraggableOffsetX(null);
      setDraggableOffsetY(null);
      setDraggableIndex(null);
      setDraggableId(null);
      setDraggableType(null);
      setTargetIndex(null);
      setTargetId(null);
      setTargetType(null);
      setPlaceholderId(null);
      setPlaceholderPosition(null);
      setNestFolderId(null);

      document.getElementById(draggableType).style.paddingBottom = '0px';

      if (targetId && targetId !== 'navigation') document.getElementById(targetId).style.backgroundColor = 'transparent';
      if (placeholderId) document.getElementById(placeholderId).style.margin = '0px';

      if (!isAllowNest && targetIndex !== null) {
        touchEndDropInFolder();
      }
      else if (targetType === 'navigation') {
        touchEndDropFromFolder();
      }
      else if (targetType === 'folder' && targetIndex !== null) {
        touchEndDropFolder();
      }

    }
  };





  const touchMoveFolder = (targetElement, targetIndex, targetElementIndex, targetElementId) => {
    // STEP 3: Define the first or all other moves
    if (targetIndex !== targetElementIndex) {
      // STEP 4: Define if draggable position is higher or lower than target
      if (draggableIndex < targetElementIndex) {
        // STEP 5: Define the spot side of the target
        if (targetElementIndex % 2 === 0) {
          if (targetElementIndex === folder?.folders?.length - 1) {
            document.getElementById('folders').style.paddingBottom = targetElement.offsetHeight + 'px';
          }
          else {
            document.getElementById(folder?.folders[targetElementIndex + 1].id).style.marginLeft = '50%';
            setPlaceholderId(folder?.folders[targetElementIndex + 1].id);
          }

          setPlaceholderPosition('left');
        }
        else if (targetElementIndex % 2 !== 0) {
          targetElement.style.marginRight = '50%';
          setPlaceholderId(targetElementId);
          setPlaceholderPosition('right');
        }
      }
      else if (draggableIndex > targetElementIndex) {
        if (targetElementIndex % 2 === 0) {
          targetElement.style.marginLeft = '50%';
          setPlaceholderId(targetElementId);
          setPlaceholderPosition('left');
        }
        else if (targetElementIndex % 2 !== 0) {
          document.getElementById(folder?.folders[targetElementIndex - 1].id).style.marginRight = '50%';
          setPlaceholderId(folder?.folders[targetElementIndex - 1].id);
          setPlaceholderPosition('right');
        }
      }
    }
    else {
      if (draggableIndex < targetElementIndex) {
        if (placeholderPosition === 'right') {
          if (targetElementIndex % 2 === 0) {
            document.getElementById(folder?.folders[targetElementIndex - 2].id).style.marginRight = '0px';
            setPlaceholderId(folder?.folders[targetElementIndex - 2].id);
            setPlaceholderPosition('left');
          }
          else if (targetElementIndex % 2 !== 0) {
            targetElement.style.marginLeft = '50%';
            setPlaceholderId(targetElementId);
            setPlaceholderPosition('left');
          }
        }
        else if (placeholderPosition === 'left') {
          if (targetElementIndex % 2 === 0) {
            if (draggableIndex + 1 === targetElementIndex) {
              document.getElementById(folder?.folders[targetElementIndex - 2].id).style.marginRight = '50%';
              setPlaceholderId(folder?.folders[targetElementIndex - 2].id);
            }
            else {
              document.getElementById(folder?.folders[targetElementIndex - 1].id).style.marginRight = '50%';
              setPlaceholderId(folder?.folders[targetElementIndex - 1].id);
            }

            setPlaceholderPosition('right');
          }
          else if (targetElementIndex % 2 !== 0) {
            targetElement.style.marginRight = '50%';
            setPlaceholderId(targetElementId);
            setPlaceholderPosition('right');
          }
        }
      }
      else if (draggableIndex > targetElementIndex) {
        if (placeholderPosition === 'right') {
          if (targetElementIndex % 2 === 0) {
            targetElement.style.marginRight = '50%';
            setPlaceholderId(targetElementId);
            setPlaceholderPosition('left');
          }
          else if (targetElementIndex % 2 !== 0) {
            if (draggableIndex === folder.folders.length - 1) {
              document.getElementById(folder?.folders[targetElementIndex + 1].id).style.marginLeft = '50%';
              setPlaceholderId(folder?.folders[targetElementIndex + 1].id);
            }
            else {
              if (draggableIndex - 1 === targetElementIndex) {
                document.getElementById(folder?.folders[targetElementIndex + 2].id).style.marginLeft = '50%';
                setPlaceholderId(folder?.folders[targetElementIndex + 2].id);
              }
              else {
                document.getElementById(folder?.folders[targetElementIndex + 1].id).style.marginLeft = '50%';
                setPlaceholderId(folder?.folders[targetElementIndex + 1].id);
              }
            }

            setPlaceholderPosition('left');
          }
        }
        else if (placeholderPosition === 'left') {
          if (targetElementIndex % 2 === 0) {
            targetElement.style.marginLeft = '50%';
            setPlaceholderId(targetElementId);
            setPlaceholderPosition('right');
          }
          else if (targetElementIndex % 2 !== 0) {
            document.getElementById(folder?.folders[targetElementIndex - 1].id).style.marginRight = '50%';
            setPlaceholderId(folder?.folders[targetElementIndex - 1].id);
            setPlaceholderPosition('right');
          }
        }
      }
    }
  };

  const handleTouchMove = e => {
    clearTimeout(timerIdDrag);
    clearTimeout(timerIdSettings);

    if (isDraggable) {
      const currentElement = e.currentTarget;

      // STEP 1: Moving draggable
      currentElement.style.left = `${e.touches[0].clientX - draggableOffsetX}px`;
      currentElement.style.top = `${e.touches[0].clientY - draggableOffsetY}px`;

      // STEP 2: Autoscroll
      let viewportHeight = window.innerHeight;
      let scrollThresholdBottom = 0.8 * viewportHeight;
      let scrollThresholdTop = 0.2 * viewportHeight;

      if (e.touches[0].clientY > scrollThresholdBottom) {
        setIsAllowScroll('bottom');
      }
      else if (e.touches[0].clientY < scrollThresholdTop) {
        setIsAllowScroll('top');
      }
      else if (e.touches[0].clientY < scrollThresholdBottom || e.touches[0].clientY > scrollThresholdTop) {
        setIsAllowScroll(false);
      }

      // STEP 3: Get target element
      document.elementsFromPoint(e.touches[0].clientX, e.touches[0].clientY).forEach(i => {
        const targetElementDraggable = i.getAttribute('data-draggable');
        const targetElementIndex = Number(i.getAttribute('data-index'));
        const targetElementId = i.getAttribute('data-id');
        const targetElementType = i.getAttribute('data-type');

        if (targetElementType === 'navigation' && draggableId !== targetElementId) {
          setTargetType(targetElementType);
          return;
        };

        if (targetElementDraggable && draggableId !== targetElementId) {
          const targetElement = document.getElementById(targetElementId);

          setTargetIndex(targetElementIndex);
          setTargetId(targetElementId);
          setTargetType(targetElementType);

          if (draggableType === 'folder') {
            if (isAllowNest) {
              setIsAllowNest(false);
              setNestFolderId(targetElementId);

              const timerNest = setTimeout(() => {
                if (placeholderId) document.getElementById(placeholderId).style.margin = '0px';
                if (draggableType === 'folder') touchMoveFolder(targetElement, targetIndex, targetElementIndex, targetElementId);

                setIsAllowNest(true);
                setNestFolderId(null);
              }, 500);
              setTimerIdNest(timerNest);
            }
            else if (!isAllowNest && nestFolderId && nestFolderId !== targetElementId) {
              clearTimeout(timerIdNest);
              setIsAllowNest(false);
              setNestFolderId(targetElementId);

              const timerNest = setTimeout(() => {
                if (placeholderId) document.getElementById(placeholderId).style.margin = '0px';
                if (draggableType === 'folder') touchMoveFolder(targetElement, targetIndex, targetElementIndex, targetElementId);

                setIsAllowNest(true);
                setNestFolderId(null);
              }, 500);
              setTimerIdNest(timerNest);
            }
          }
        }
      });
    }
  };





  return (
    <div ref={managerRef} id="manager" className={css.container}>
      <div className={css.header}>
        <FolderNavigation name={folder?.name} />
      </div>
      <div className={`${css.content} ${folder?.name && css.contentOffset}`}>
        <Folders
          folders={folder?.folders}
          handleTouchStart={handleTouchStart}
          handleTouchEnd={handleTouchEnd}
          handleTouchMove={handleTouchMove}
        />
        <Notes notes={folder?.notes}
          handleTouchStart={handleTouchStart}
          handleTouchEnd={handleTouchEnd}
          handleTouchMove={handleTouchMove}
        />
        <Tasks tasks={folder?.tasks}
          handleTouchStart={handleTouchStart}
          handleTouchEnd={handleTouchEnd}
          handleTouchMove={handleTouchMove}
        />
      </div>
    </div>
  );
});
