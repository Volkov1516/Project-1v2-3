import { memo, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSnackbar } from 'redux/features/app/appSlice';
// import { updateDocuments } from 'redux/features/user/userSlice';
// import { db } from 'firebase.js';
// import { doc, setDoc } from 'firebase/firestore';

import { FolderNavigation } from './FolderNavigation/FolderNavigation';
import { Folders } from './Folders/Folders';
import { Notes } from './Notes/Notes';
import { Tasks } from './Tasks/Tasks';

import css from './Content.module.css';

// import { findFolder } from 'utils/findFolder';

export const Content = memo(function MemoizedContent() {
  let timerDrag;

  const dispatch = useDispatch();

  // const { userId, documents, path } = useSelector(state => state.user);
  const { documents, path } = useSelector(state => state.user);

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
  // const [prevTargetId, setPrevTargetId] = useState(null);
  const [placeholderId, setPlaceholderId] = useState(null);
  const [placeholderPosition, setPlaceholderPosition] = useState(null);
  // const [updatedFolder, setUpdatedFolder] = useState(null);

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
      const managerElement = document.getElementById('manager');
      const containerElement = document.getElementById('folders');
      managerElement.scrollTop += 1;

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
      const elementsLength = folder.folders.length;

      if (elementsLength === 1) {
        // If only one element
        containerElement.style.paddingBottom = currentElement.offsetHeight + 'px';
      }
      else {
        // If more than one element
        if (index === 0) {
          // If draggable - first element
          document.getElementById(folder.folders[index + 1].id).style.marginLeft = '50%';
          setPlaceholderId(folder.folders[index + 1].id);
        }
        else if (index === folder.folders.length - 1) {
          // If draggable - last element
          if (index % 2 === 0) {
            containerElement.style.paddingBottom = currentElement.offsetHeight + 'px';
          }
          else if (index % 2 !== 0) {
            document.getElementById(folder.folders[folder.folders.length - 2].id).style.marginRight = '50%';
            setPlaceholderId(folder.folders[folder.folders.length - 2].id);
          }
        }
        else {
          // If element is any from inside
          if (index % 2 === 0) {
            document.getElementById(folder.folders[index + 1].id).style.marginLeft = '50%';
            setPlaceholderId(folder.folders[index + 1].id);
          }
          else if (index % 2 !== 0) {
            document.getElementById(folder.folders[index - 1].id).style.marginRight = '50%';
            setPlaceholderId(folder.folders[index - 1].id);
          }
        }
      }
    }, 200);
  };

  const handleTouchEnd = async e => {
    clearTimeout(timerDrag);

    // STEP 1: Get current element + remove touch effect
    const currentElement = e.currentTarget;
    currentElement.classList.remove(css.touch);

    if (isDraggable) {
      // STEP -: Reset styles (draggable + target + placeholder + container)
      currentElement.style.position = 'initial';
      currentElement.style.left = 'initial';
      currentElement.style.top = 'initial';
      currentElement.style.padding = '0px';
      currentElement.style.backgroundColor = 'initial';
      currentElement.style.opacity = 1;

      if (targetId) document.getElementById(targetId).style.backgroundColor = 'transparent';

      if (placeholderId) document.getElementById(placeholderId).style.margin = '0px';

      document.getElementById('folders').style.paddingBottom = '0px';

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
      // setPrevTargetId(null);
      setPlaceholderId(null);
      setPlaceholderPosition(null);

      if (targetIndex) {
        // STEP -: Update folders in user.documents (Firebase)
        try {
          // const newDocuments = JSON.parse(JSON.stringify(documents));
          // const changeFolderPosition = (targetFolder) => targetFolder.folders = updatedFolder;
          // findFolder(newDocuments, path[path.length - 1], changeFolderPosition);

          // dispatch(updateDocuments(newDocuments));

          // await setDoc(doc(db, 'users', userId), { documents: newDocuments }, { merge: true });

          dispatch(setSnackbar('Changes were applied'));
        } catch (error) {
          dispatch(setSnackbar('Something went wrong'));
        }
      }
    }
  };

  const handleTouchMove = e => {
    clearTimeout(timerDrag);

    if (isDraggable) {
      const currentElement = e.currentTarget;

      // STEP 1: Moving draggable
      currentElement.style.left = `${e.touches[0].clientX - draggableOffsetX}px`;
      currentElement.style.top = `${e.touches[0].clientY - draggableOffsetY}px`;

      // STEP 2: Get target element
      document.elementsFromPoint(e.touches[0].clientX, e.touches[0].clientY).forEach(i => {
        const targetElementDraggable = i.getAttribute('data-draggable');
        const targetElementIndex = Number(i.getAttribute('data-index'));
        const targetElementId = i.getAttribute('data-id');

        if (targetElementDraggable && draggableId !== targetElementId) {
          const targetElement = document.getElementById(targetElementId);

          setTargetIndex(targetElementIndex);
          setTargetId(targetElementId);

          if (placeholderId) document.getElementById(placeholderId).style.margin = '0px';

          // STEP 3: Define the first or all other moves
          if (targetIndex !== targetElementIndex) {
            // STEP 4: Define if draggable position is higher or lower than target
            if (draggableIndex < targetElementIndex) {
              // STEP 5: Define the spot side of the target
              if (targetElementIndex % 2 === 0) {
                if (targetElementIndex === folder?.folders?.length - 1) {
                  document.getElementById('folders').style.paddingBottom = currentElement.offsetHeight + 'px';
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
                    document.getElementById('folders').style.paddingBottom = currentElement.offsetHeight + 'px';
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
        }
      });
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
      <Notes notes={folder?.notes} />
      <Tasks tasks={folder?.tasks} />
    </div>
  );
});
