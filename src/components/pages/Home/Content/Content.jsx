import { memo, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSnackbar } from 'redux/features/app/appSlice';
import { updateDocuments } from 'redux/features/user/userSlice';
import { db } from 'firebase.js';
import { doc, setDoc } from 'firebase/firestore';

import { FolderNavigation } from './FolderNavigation/FolderNavigation';
import { Folders } from './Folders/Folders';
import { Notes } from './Notes/Notes';
import { Tasks } from './Tasks/Tasks';

import css from './Content.module.css';

import { findFolder } from 'utils/findFolder';

export const Content = memo(function MemoizedContent() {
  let timerDrag;

  const dispatch = useDispatch();

  const { userId, documents, path } = useSelector(state => state.user);

  const [folder, setFolder] = useState(null);
  const [isDraggable, setIsDraggable] = useState(false);
  const [draggableIndex, setDraggableIndex] = useState(null);
  const [draggableId, setDraggableId] = useState(null);
  // const [draggableType, setDraggableType] = useState(null);
  const [draggableOffsetX, setDraggableOffsetX] = useState(null);
  const [draggableOffsetY, setDraggableOffsetY] = useState(null);
  const [targetIndex, setTargetIndex] = useState(null);
  const [targetId, setTargetId] = useState(null);
  // const [targetType, setTargetType] = useState(null);
  const [prevTargetId, setPrevTargetId] = useState(null);
  const [placeholderId, setPlaceholderId] = useState(null);
  const [newDocuments, setNewDocuments] = useState(null);

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


  const handleTouchStart = (e, index, id, name, type) => {
    // STEP 1: Get current element + set touch effect
    const currentElement = e.currentTarget;
    currentElement.classList.add(css.touch);

    // STEP 2: Run timer for Drag And Drop (clear timer on touch move)
    timerDrag = setTimeout(() => {
      // STEP 3: Set isDraggable and draggable data
      setIsDraggable(true);
      setDraggableIndex(index);
      setDraggableId(id);
      // setDraggableType(type);

      // STEP 4: Set element offsets to sycn with pointer move
      const offsetX = e.touches[0].clientX - currentElement.getBoundingClientRect().left;
      const offsetY = e.touches[0].clientY - currentElement.getBoundingClientRect().top;
      setDraggableOffsetX(offsetX);
      setDraggableOffsetY(offsetY);

      // STEP 5: Set styles
      currentElement.style.position = 'absolute';
      currentElement.style.left = `${e.touches[0].clientX - offsetX}px`;
      currentElement.style.top = `${e.touches[0].clientY - offsetY}px`;
      currentElement.style.padding = '16px';
      currentElement.style.backgroundColor = 'transparent';
      currentElement.style.opacity = 0.5;

      // STEP 6: Set placeholder
      const elementsLength = folder?.folders?.length;

      if (elementsLength === 1) {
        // If only one element
        const containerElement = document.getElementById('folders');
        containerElement.style.paddingBottom = currentElement.offsetHeight + 'px';
      }
      else {
        // If more than one element
        if (index === 0) {
          // If draggable - first element
          const nextElement = document.getElementById(folder?.folders[index + 1].id);
          nextElement.style.marginLeft = '50%';
          setPlaceholderId(folder?.folders[index + 1].id);
        }
        else if (index === folder?.folders?.length - 1) {
          // If draggable - last element
          const prevElement = document.getElementById(folder?.folders[folder?.folders?.length - 2].id);
          const preveElementIndex = prevElement.getAttribute('data-index');

          if (preveElementIndex % 2 !== 0) {
            const containerElement = document.getElementById('folders');
            containerElement.style.paddingBottom = currentElement.offsetHeight + 'px';
          }
          else if (preveElementIndex % 2 === 0) {
            prevElement.style.marginRight = '50%';
            setPlaceholderId(folder?.folders[folder?.folders?.length - 2].id);
          }
        }
        else {
          // If element is any from inside

          if (index % 2 === 0) {
            const nextElement = document.getElementById(folder?.folders[index + 1].id);
            nextElement.style.marginLeft = '50%';
            setPlaceholderId(folder?.folders[index + 1].id);
          }
          else if (index % 2 !== 0) {
            const prevElement = document.getElementById(folder?.folders[index - 1].id);
            prevElement.style.marginRight = '50%';
            setPlaceholderId(folder?.folders[index - 1].id);
          }
        }
      }
    }, 200);
  };

  const handleTouchEnd = async (e, index, id, name, type) => {
    // STEP 1: Get current element + remove touch effect
    const currentElement = e.currentTarget;
    currentElement.classList.remove(css.touch);
    clearTimeout(timerDrag);

    if (isDraggable) {
      // STEP -: Reset styles (draggable + target + placeholder + container)
      currentElement.style.position = 'initial';
      currentElement.style.left = 'initial';
      currentElement.style.top = 'initial';
      currentElement.style.padding = '0px';
      currentElement.style.backgroundColor = 'initial';
      currentElement.style.opacity = 1;

      if (targetId) {
        const targetElement = document.getElementById(targetId);
        targetElement.style.backgroundColor = 'transparent';
      }

      if (placeholderId) {
        const placeholderElement = document.getElementById(placeholderId);
        placeholderElement.style.margin = '0px';
      }

      const containerElement = document.getElementById('folders');
      containerElement.style.paddingBottom = '0px';

      // STEP -: Reset data
      setIsDraggable(false);
      setDraggableIndex(null);
      setDraggableId(null);
      // setDraggableType(null);
      setDraggableOffsetX(null);
      setDraggableOffsetY(null);
      setTargetIndex(null);
      setTargetId(null);
      // setTargetType(null);
      setPrevTargetId(null);
      setPlaceholderId(null);

      // STEP -: Update folders in user.documents (Firebase)
      try {
        await setDoc(doc(db, 'users', userId), { documents: newDocuments }, { merge: true });

        dispatch(setSnackbar('Changes were applied'));
      } catch (error) {
        dispatch(setSnackbar('Something went wrong'));
      }
    }
  };

  const handleTouchMove = (e) => {
    const currentElement = e.currentTarget;
    clearTimeout(timerDrag);

    if (isDraggable) {
      // STEP 1: Moving draggable
      currentElement.style.left = `${e.touches[0].clientX - draggableOffsetX}px`;
      currentElement.style.top = `${e.touches[0].clientY - draggableOffsetY}px`;

      // STEP 2: Get and set target element
      const elementsBelow = document.elementsFromPoint(e.touches[0].clientX, e.touches[0].clientY);
      elementsBelow.forEach(i => {
        if (i.getAttribute('data-index')) {
          setTargetIndex(i.getAttribute('data-index'));
          setTargetId(i.getAttribute('data-id'));
          // setTargetType(i.getAttribute('data-type'));
        }
      });

      if (targetId && prevTargetId && targetId !== prevTargetId) {
        const targetElement = document.getElementById(prevTargetId);
        targetElement.style.backgroundColor = 'transparent';
      }

      if (targetId && targetId !== draggableId) {
        const targetElement = document.getElementById(targetId);
        targetElement.style.backgroundColor = '#EEEEEE';

        setPrevTargetId(targetId);

        // Remove prev placeholder
        if (placeholderId) {
          const placeholderElement = document.getElementById(placeholderId);
          placeholderElement.style.margin = '0px';
        }

        if (draggableIndex < targetIndex) {
          // STEP -: Display placeholder
          if (targetIndex % 2 === 0) {
            if (Number(targetIndex) === folder?.folders?.length - 1) {
              const containerElement = document.getElementById('folders');
              containerElement.style.paddingBottom = currentElement.offsetHeight + 'px';
            }
            else {
              const nextElement = document.getElementById(folder?.folders[Number(targetIndex) + 1].id);
              nextElement.style.marginLeft = '50%';
              setPlaceholderId(folder?.folders[Number(targetIndex) + 1].id);
            }
          }
          else if (targetIndex % 2 !== 0) {
            const nextElement = document.getElementById(targetId);
            nextElement.style.marginRight = '50%';
            setPlaceholderId(targetId);
          }

          // STEP -: Swap index
          const foldersCopy = folder.folders;
          const draggableFolder = foldersCopy[draggableIndex];
          const targetFolder = foldersCopy[targetIndex];

          const beforeDraggable = foldersCopy.slice(0, draggableIndex);
          const elementsBetween = foldersCopy.slice(Number(draggableIndex) + 1, targetIndex);
          const afterTarget = foldersCopy.slice(Number(targetIndex) + 1);

          const newFolders = [
            ...beforeDraggable,
            ...elementsBetween,
            targetFolder,
            draggableFolder,
            ...afterTarget
          ];

          const newDocuments = JSON.parse(JSON.stringify(documents));

          const changeFolderPosition = (targetFolder) => {
            targetFolder.folders = newFolders;
          };

          findFolder(newDocuments, path[path.length - 1], changeFolderPosition);
          dispatch(updateDocuments(newDocuments));
          setNewDocuments(newDocuments);
          setDraggableIndex(Number(targetIndex));
        }
        else if (draggableIndex > targetIndex) {
          if (targetIndex % 2 === 0) {
            const prevElement = document.getElementById(targetId);
            prevElement.style.marginLeft = '50%';
            setPlaceholderId(targetId);
          }
          else if (targetIndex % 2 !== 0) {
            const nextElement = document.getElementById(folder?.folders[Number(targetIndex) - 1].id);
            nextElement.style.marginRight = '50%';
            setPlaceholderId(folder?.folders[Number(targetIndex) - 1].id);
          }

          // STEP -: Swap index
          const foldersCopy = folder.folders;
          const draggableFolder = foldersCopy[draggableIndex];
          const targetFolder = foldersCopy[targetIndex];

          const afterDraggable = foldersCopy.slice(Number(draggableIndex) + 1);
          const elementsBetween = foldersCopy.slice(Number(targetIndex) + 1, draggableIndex);
          const beforeTarget = foldersCopy.slice(0, targetIndex);

          const newFolders = [
            ...beforeTarget,
            draggableFolder,
            targetFolder,
            ...elementsBetween,
            ...afterDraggable
          ];

          const newDocuments = JSON.parse(JSON.stringify(documents));

          const changeFolderPosition = (targetFolder) => {
            targetFolder.folders = newFolders;
          };

          findFolder(newDocuments, path[path.length - 1], changeFolderPosition);
          dispatch(updateDocuments(newDocuments));
          setNewDocuments(newDocuments);
          setDraggableIndex(Number(targetIndex));
        }
      }
    }
  };

  return (
    <div id="manager" className={css.container}>
      <FolderNavigation name={folder?.name} />
      <Folders
        folders={folder?.folders}
        handleTouchStart={handleTouchStart}
        handleTouchEnd={handleTouchEnd}
        handleTouchMove={handleTouchMove}
      />
      <Notes
        notes={folder?.notes}
        handleTouchStart={handleTouchStart}
        handleTouchEnd={handleTouchEnd}
        handleTouchMove={handleTouchMove}
      />
      <Tasks tasks={folder?.tasks} />
    </div>
  );
});
