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

import { findFolder, getParentFolder } from 'utils/searchInManager';
import { getNavigationPathId } from 'utils/getNavigationId';

export const Manager = memo(function MemoizedComponent() {
  const dispatch = useDispatch();

  const { theme, appPathname } = useSelector(state => state.app);
  const { userId, documents } = useSelector(state => state.user);

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
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [preventOnClick, setPreventOnClick] = useState(false);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let activePathId;

    if (appPathname) {
      let navPathCopy = appPathname;
      let newNavPath = navPathCopy?.split('/');

      if (navPathCopy.includes('folder')) {
        newNavPath?.forEach(i => {
          if (i.includes('folder')) {
            activePathId = i.split('=')[1];
          }
        });
      }
      else {
        activePathId = 'root';
      }
    }
    else {
      activePathId = 'root';
    }

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

      return null;
    }

    let res = findFolder(documents, activePathId);
    setFolder(res);
  }, [documents, appPathname]);

  useEffect(() => {
    if (isAllowScroll === 'bottom') {
      const isScrolling = setInterval(function () {
        managerRef.current.scrollTop += 4;
      }, 10);
      setTimerIdScroll(isScrolling);
    }
    else if (isAllowScroll === 'top') {
      const isScrolling = setInterval(function () {
        managerRef.current.scrollTop -= 4;
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
    currentElement.style.padding = '16px';
    currentElement.style.backgroundColor = 'transparent';
    currentElement.style.opacity = 0.5;

    if (windowWidth < 639) {
      currentElement.style.left = `${e.touches[0].clientX - offsetX}px`;
      currentElement.style.top = `${e.touches[0].clientY - offsetY}px`;
    }
    else {
      currentElement.style.left = `${e.clientX - offsetX}px`;
      currentElement.style.top = `${e.clientY - offsetY}px`;
    }

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
    let scrollWidth = managerRef.current.offsetWidth - managerRef.current.clientWidth;
    let managerWidthWithoutScroll = managerRef.current.getBoundingClientRect().width - scrollWidth;

    currentElement.style.position = 'absolute';
    currentElement.style.opacity = 0.5;

    if (windowWidth < 639) {
      currentElement.style.left = `${e.touches[0].clientX - offsetX}px`;
      currentElement.style.top = `${e.touches[0].clientY - offsetY}px`;
      currentElement.style.width = '100%';
    }
    else {
      currentElement.style.left = `${e.clientX - offsetX}px`;
      currentElement.style.top = `${e.clientY - offsetY}px`;
      currentElement.style.width = managerWidthWithoutScroll + 'px';
    }

    if (theme === 'dark') {
      currentElement.style.backgroundColor = '#333333';
    }
    else {
      currentElement.style.backgroundColor = '#EEEEEE';
    }

    // Set placeholder
    if (contentArray.length === 1) {
      document.getElementById(type).style.paddingBottom = currentElementHeight;
    }
    else {
      if (index === contentArray.length - 1) {
        document.getElementById(contentArray[contentArray.length - 2].id).style.marginBottom = currentElementHeight;
        setPlaceholderId(contentArray[contentArray.length - 2].id);
      }
      else {
        document.getElementById(contentArray[index + 1].id).style.marginTop = currentElementHeight;
        setPlaceholderId(contentArray[index + 1].id);
      }
    }
  };

  const touchStartOpenModal = (e, index, id, name, type, openSettingsModal, currentElement, contentArray) => {
    const timerOpenModal = setTimeout(() => {
      setIsDraggable(false);

      // if (type === 'note') {
      //   window.history.pushState({}, '', 'editNote');
      // }
      // else if (type === 'folder') {
      //   window.history.pushState({}, '', 'editFolder');
      // }

      // const navEvent = new PopStateEvent('popstate');
      // window.dispatchEvent(navEvent);

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

  const handleTouchStart = (e, index, id, type, name, openSettingsModal) => {
    const currentElement = e.currentTarget;

    if (type !== 'task') currentElement.classList.add(css.touch);

    const timerDrag = setTimeout(() => {
      setIsDraggable(true);
      setDraggableIndex(index);
      setDraggableId(id);
      setDraggableType(type);

      let offsetX;
      let offsetY;

      if (windowWidth < 639) {
        offsetX = e.touches[0].clientX - currentElement.getBoundingClientRect().left;
        offsetY = e.touches[0].clientY - currentElement.getBoundingClientRect().top;
      }
      else {
        setPreventOnClick(true);
        offsetX = e.clientX - currentElement.getBoundingClientRect().left;
        offsetY = e.clientY - currentElement.getBoundingClientRect().top;
      }

      setDraggableOffsetX(offsetX);
      setDraggableOffsetY(offsetY);

      // Prevent draggable lagging on touch if move down
      managerRef.current.scrollTop += 1;

      if (type === 'folder') {
        if (windowWidth < 639) {
          touchStartFolder(e, index, type, currentElement, offsetX, offsetY, folder[`${type}s`]);
        }
        else {
          touchStartUniversal(e, index, type, currentElement, offsetX, offsetY, folder[`${type}s`]);
        }
      }
      else {
        touchStartUniversal(e, index, type, currentElement, offsetX, offsetY, folder[`${type}s`]);
      }

      if (type !== 'task' && windowWidth < 639) touchStartOpenModal(e, index, id, name, type, openSettingsModal, currentElement, folder[`${type}s`]);
    }, 200);
    setTimerIdDrag(timerDrag);
  };

  const touchMoveFolder = (targetElement, targetIndex, targetElementIndex, targetElementId) => {
    const timerMoveFolder = setTimeout(() => {
      if (placeholderId) document.getElementById(placeholderId).style.margin = '0px';

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
              setPlaceholderPosition('right');
            }
            else if (targetElementIndex % 2 !== 0) {
              if (draggableIndex === folder.folders.length - 1) {
                document.getElementById(folder?.folders[targetElementIndex + 1].id).style.marginLeft = '50%';
                setPlaceholderId(folder?.folders[targetElementIndex + 1].id);
                setPlaceholderPosition('left');
              }
              else {
                if (draggableIndex - 1 === targetElementIndex) {
                  document.getElementById(folder?.folders[targetElementIndex + 2].id).style.marginLeft = '50%';
                  setPlaceholderId(folder?.folders[targetElementIndex + 2].id);
                  setPlaceholderPosition('left');
                }
                else {
                  document.getElementById(folder?.folders[targetElementIndex + 1].id).style.marginLeft = '50%';
                  setPlaceholderId(folder?.folders[targetElementIndex + 1].id);
                  setPlaceholderPosition('left');
                }
              }
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

      setIsAllowNest(true);
      setNestFolderId(null);
    }, 500);
    setTimerIdNest(timerMoveFolder);
  };

  const touchMoveFolderDesktop = (targetElement, targetIndex, targetElementIndex, targetElementId) => {
    const timerMoveFolder = setTimeout(() => {
      if (placeholderId) document.getElementById(placeholderId).style.margin = '0px';

      if (targetIndex !== targetElementIndex) {
        if (draggableIndex < targetElementIndex) {
          document.getElementById(folder[`${draggableType}s`][targetElementIndex].id).style.marginBottom = targetElement.offsetHeight + 'px';
          setPlaceholderId(folder[`${draggableType}s`][targetElementIndex].id);
          setPlaceholderPosition('bottom');
        }
        else if (draggableIndex > targetElementIndex) {
          document.getElementById(folder[`${draggableType}s`][targetElementIndex].id).style.marginTop = targetElement.offsetHeight + 'px';
          setPlaceholderId(folder[`${draggableType}s`][targetElementIndex].id);
          setPlaceholderPosition('top');
        }
      }
      else {
        if (draggableIndex < targetElementIndex) {
          if (placeholderPosition === 'bottom') {
            document.getElementById(folder[`${draggableType}s`][targetElementIndex].id).style.marginTop = targetElement.offsetHeight + 'px';
            setPlaceholderId(folder[`${draggableType}s`][targetElementIndex].id);
            setPlaceholderPosition('top');
          }
          else if (placeholderPosition === 'top') {
            document.getElementById(folder[`${draggableType}s`][targetElementIndex].id).style.marginBottom = targetElement.offsetHeight + 'px';
            setPlaceholderId(folder[`${draggableType}s`][targetElementIndex].id);
            setPlaceholderPosition('bottom');
          }
        }
        else if (draggableIndex > targetElementIndex) {
          if (placeholderPosition === 'bottom') {
            document.getElementById(folder[`${draggableType}s`][targetElementIndex].id).style.marginTop = targetElement.offsetHeight + 'px';
            setPlaceholderId(folder[`${draggableType}s`][targetElementIndex].id);
            setPlaceholderPosition('top');
          }
          else if (placeholderPosition === 'top') {
            document.getElementById(folder[`${draggableType}s`][targetElementIndex].id).style.marginBottom = targetElement.offsetHeight + 'px';
            setPlaceholderId(folder[`${draggableType}s`][targetElementIndex].id);
            setPlaceholderPosition('bottom');
          }
        }
      }

      setIsAllowNest(true);
      setNestFolderId(null);
    }, 500);
    setTimerIdNest(timerMoveFolder);
  };

  const touchMoveUniversal = (targetElement, targetIndex, targetElementIndex, targetElementId) => {
    if (placeholderId) document.getElementById(placeholderId).style.margin = '0px';

    if (targetIndex !== targetElementIndex) {
      if (draggableIndex < targetElementIndex) {
        document.getElementById(folder[`${draggableType}s`][targetElementIndex].id).style.marginBottom = targetElement.offsetHeight + 'px';
        setPlaceholderId(folder[`${draggableType}s`][targetElementIndex].id);
        setPlaceholderPosition('bottom');
      }
      else if (draggableIndex > targetElementIndex) {
        document.getElementById(folder[`${draggableType}s`][targetElementIndex].id).style.marginTop = targetElement.offsetHeight + 'px';
        setPlaceholderId(folder[`${draggableType}s`][targetElementIndex].id);
        setPlaceholderPosition('top');
      }
    }
    else {
      if (draggableIndex < targetElementIndex) {
        if (placeholderPosition === 'bottom') {
          document.getElementById(folder[`${draggableType}s`][targetElementIndex].id).style.marginTop = targetElement.offsetHeight + 'px';
          setPlaceholderId(folder[`${draggableType}s`][targetElementIndex].id);
          setPlaceholderPosition('top');
        }
        else if (placeholderPosition === 'top') {
          document.getElementById(folder[`${draggableType}s`][targetElementIndex].id).style.marginBottom = targetElement.offsetHeight + 'px';
          setPlaceholderId(folder[`${draggableType}s`][targetElementIndex].id);
          setPlaceholderPosition('bottom');
        }
      }
      else if (draggableIndex > targetElementIndex) {
        if (placeholderPosition === 'bottom') {
          document.getElementById(folder[`${draggableType}s`][targetElementIndex].id).style.marginTop = targetElement.offsetHeight + 'px';
          setPlaceholderId(folder[`${draggableType}s`][targetElementIndex].id);
          setPlaceholderPosition('top');
        }
        else if (placeholderPosition === 'top') {
          document.getElementById(folder[`${draggableType}s`][targetElementIndex].id).style.marginBottom = targetElement.offsetHeight + 'px';
          setPlaceholderId(folder[`${draggableType}s`][targetElementIndex].id);
          setPlaceholderPosition('bottom');
        }
      }
    }
  };

  const handleTouchMove = e => {
    clearTimeout(timerIdDrag);
    clearTimeout(timerIdSettings);

    if (isDraggable) {
      const currentElement = e.currentTarget;
      let clientX;
      let clientY;

      if (windowWidth < 639) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }
      else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      // STEP 1: Moving draggable
      if (draggableType === 'folder' && windowWidth < 639) {
        currentElement.style.left = `${clientX - draggableOffsetX}px`;
        currentElement.style.top = `${clientY - draggableOffsetY}px`;
      }
      else {
        currentElement.style.top = `${clientY - draggableOffsetY}px`;
      }

      // STEP 2: Autoscroll
      let viewportHeight = window.innerHeight;
      let scrollThresholdBottom = 0.8 * viewportHeight;
      let scrollThresholdTop = 0.2 * viewportHeight;

      if (clientY > scrollThresholdBottom) {
        setIsAllowScroll('bottom');
      }
      else if (clientY < scrollThresholdTop) {
        setIsAllowScroll('top');
      }
      else if (clientY < scrollThresholdBottom || clientY > scrollThresholdTop) {
        setIsAllowScroll(false);
      }

      // STEP 3: Get target element
      document.elementsFromPoint(clientX, clientY).forEach(i => {
        const targetElementIndex = Number(i.getAttribute('data-index'));
        const targetElementId = i.getAttribute('data-id');
        const targetElementType = i.getAttribute('data-type');

        if (targetElementType === 'navigation') {
          setTargetType(targetElementType);
          return;
        };

        if (targetElementId && targetElementId !== draggableId) {
          setTargetIndex(targetElementIndex);
          setTargetId(targetElementId);
          setTargetType(targetElementType);

          const targetElement = document.getElementById(targetElementId);

          if (draggableType === 'folder' && targetElementType === 'folder') {
            if (isAllowNest) {
              setIsAllowNest(false);
              setNestFolderId(targetElementId);

              if (windowWidth < 639) {
                touchMoveFolder(targetElement, targetIndex, targetElementIndex, targetElementId);
              }
              else {
                touchMoveFolderDesktop(targetElement, targetIndex, targetElementIndex, targetElementId);
              }
            }
            else if (!isAllowNest && nestFolderId && nestFolderId !== targetElementId) {
              clearTimeout(timerIdNest);
              setIsAllowNest(false);
              setNestFolderId(targetElementId);

              if (windowWidth < 639) {
                touchMoveFolder(targetElement, targetIndex, targetElementIndex, targetElementId);
              }
              else {
                touchMoveFolderDesktop(targetElement, targetIndex, targetElementIndex, targetElementId);
              }
            }
          }
          else if (draggableType === 'note' && targetElementType === 'note') {
            touchMoveUniversal(targetElement, targetIndex, targetElementIndex, targetElementId);
          }
          else if (draggableType === 'task' && targetElementType === 'task') {
            touchMoveUniversal(targetElement, targetIndex, targetElementIndex, targetElementId);
          }
        }
      });
    }
  };

  const touchEndDropInFolder = async () => {
    setPlaceholderId(null);

    try {
      const navigationPathId = getNavigationPathId(appPathname, 'folder');

      const documentsCopy = JSON.parse(JSON.stringify(documents));

      const removeDraggable = targetFolder => {
        // Move draggable into target fodler
        targetFolder.folders[targetIndex][`${draggableType}s`].push(folder[`${draggableType}s`][draggableIndex]);
        // Delete draggable from current place
        targetFolder[`${draggableType}s`].splice(draggableIndex, 1);
      };
      findFolder(documentsCopy, navigationPathId, removeDraggable);

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

      const navigationPathId = getNavigationPathId(appPathname, 'folder');
      const parentFodlerId = getParentFolder(documents, navigationPathId);

      const removeDraggable = targetFolder => targetFolder[`${draggableType}s`] = draggableArrayCopy;
      findFolder(documentsCopy, navigationPathId, removeDraggable);

      const moveDraggableOutside = (targetFolder) => targetFolder[`${draggableType}s`].push(draggableObject);
      findFolder(documentsCopy, parentFodlerId, moveDraggableOutside);

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

        const navigationPathId = getNavigationPathId(appPathname, 'folder');
        const changeFolderPosition = (targetFolder) => targetFolder.folders = newFolders;
        findFolder(newDocuments, navigationPathId, changeFolderPosition);
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

        const navigationPathId = getNavigationPathId(appPathname, 'folder');
        const changeFolderPosition = (targetFolder) => targetFolder.folders = newFolders;
        findFolder(newDocuments, navigationPathId, changeFolderPosition);
      }

      dispatch(updateDocuments(newDocuments));

      await setDoc(doc(db, 'users', userId), { documents: newDocuments }, { merge: true });

      dispatch(setSnackbar('Changes were applied'));
    } catch (error) {
      dispatch(setSnackbar('Something went wrong'));
    }
  };

  const touchEndDropUniversal = async () => {
    try {
      const newDocuments = JSON.parse(JSON.stringify(documents));
      const draggableTypeArrayCopy = folder[`${draggableType}s`];
      const draggableElement = draggableTypeArrayCopy[draggableIndex];
      const targetElement = draggableTypeArrayCopy[targetIndex];

      let newTypeArray;

      if (draggableIndex < targetIndex) {
        const beforeDraggable = draggableTypeArrayCopy.slice(0, draggableIndex);
        const elementsBetween = draggableTypeArrayCopy.slice(Number(draggableIndex) + 1, targetIndex);
        const afterTarget = draggableTypeArrayCopy.slice(Number(targetIndex) + 1);

        if (placeholderPosition === 'top') {
          newTypeArray = [
            ...beforeDraggable,
            ...elementsBetween,
            draggableElement,
            targetElement,
            ...afterTarget
          ];
        }
        else if (placeholderPosition === 'bottom') {
          newTypeArray = [
            ...beforeDraggable,
            ...elementsBetween,
            targetElement,
            draggableElement,
            ...afterTarget
          ];
        }
      }
      else if (draggableIndex > targetIndex) {
        const afterDraggable = draggableTypeArrayCopy.slice(Number(draggableIndex) + 1);
        const elementsBetween = draggableTypeArrayCopy.slice(Number(targetIndex) + 1, draggableIndex);
        const beforeTarget = draggableTypeArrayCopy.slice(0, targetIndex);

        if (placeholderPosition === 'top') {
          newTypeArray = [
            ...beforeTarget,
            draggableElement,
            targetElement,
            ...elementsBetween,
            ...afterDraggable
          ];
        }
        else if (placeholderPosition === 'bottom') {
          newTypeArray = [
            ...beforeTarget,
            targetElement,
            draggableElement,
            ...elementsBetween,
            ...afterDraggable
          ];
        }
      }

      const navigationPathId = getNavigationPathId(appPathname, 'folder');
      const changeElementPosition = (targetFolder) => targetFolder[`${draggableType}s`] = newTypeArray;
      findFolder(newDocuments, navigationPathId, changeElementPosition);

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

      if (draggableType === 'note') {
        currentElement.style.padding = '4px 8px 4px 16px';
      }

      if (windowWidth > 639 && draggableType === 'folder') {
        currentElement.style.padding = '4px 8px 4px 16px';
      }

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

      if (targetType === 'navigation') {
        touchEndDropFromFolder();
      }
      else if (!isAllowNest && targetIndex !== null) {
        touchEndDropInFolder();
      }
      else if (draggableType === 'folder' && targetType === 'folder' && targetIndex !== null) {
        if (windowWidth < 639) {
          touchEndDropFolder();
        }
        else {
          touchEndDropUniversal();
        }
      }
      else if (draggableType === 'note' && targetType === 'note' && targetIndex !== null) {
        touchEndDropUniversal();
      }
      else if (draggableType === 'task' && targetType === 'task' && targetIndex !== null) {
        touchEndDropUniversal();
      }
      else if ((draggableType === 'note' || 'task') && targetType === 'folder' && targetIndex !== null) {
        touchEndDropInFolder();
      }

      setTimeout(() => setPreventOnClick(false), 0);
    }
  };

  return (
    <div ref={managerRef} className={css.container}>
      <div className={css.header}>
        <FolderNavigation name={folder?.name} />
      </div>
      <div className={`${css.content} ${folder?.name && css.contentOffset}`}>
        <Folders
          folders={folder?.folders}
          preventOnClick={preventOnClick}
          handleTouchStart={handleTouchStart}
          handleTouchEnd={handleTouchEnd}
          handleTouchMove={handleTouchMove}
        />
        <Notes
          notes={folder?.notes}
          preventOnClick={preventOnClick}
          windowWidth={windowWidth}
          handleTouchStart={handleTouchStart}
          handleTouchEnd={handleTouchEnd}
          handleTouchMove={handleTouchMove}
        />
        <Tasks
          tasks={folder?.tasks}
          isDraggable={isDraggable}
          handleTouchStart={handleTouchStart}
          handleTouchEnd={handleTouchEnd}
          handleTouchMove={handleTouchMove}
        />
      </div>
    </div>
  );
});
