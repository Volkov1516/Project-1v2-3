import { createContext, useContext, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { moveFromFolder, moveInFolder, moveFolder, moveUniversal } from 'redux/features/user/userSlice';

const DragAndDropContext = createContext();

export const useDragAndDrop = () => useContext(DragAndDropContext);

export const DragAndDropProvider = ({ children, folder, windowWidth }) => {
  const dispatch = useDispatch();

  const [isDraggable, setIsDraggable] = useState(false);
  const [draggableOffsetX, setDraggableOffsetX] = useState(null);
  const [draggableOffsetY, setDraggableOffsetY] = useState(null);
  const [draggable, setDraggable] = useState(null);
  const [target, setTarget] = useState(null);
  const [placeholderId, setPlaceholderId] = useState(null);
  const [placeholderPosition, setPlaceholderPosition] = useState(null);
  const [timerIdDragStart, setTimerIdDrag] = useState(null);
  const [timerIdSettings, setTimerIdSettings] = useState(null);
  const [timerIdScroll, setTimerIdScroll] = useState(null);
  const [timerIdNest, setTimerIdNest] = useState(null);
  const [isAllowScroll, setIsAllowScroll] = useState(false);
  const [preventOnClick, setPreventOnClick] = useState(false);
  const [isAllowNest, setIsAllowNest] = useState(true);
  const [nestFolderId, setNestFolderId] = useState(null);

  useEffect(() => {
    const managerContent = document.getElementById('managerContent');

    if (isAllowScroll === 'bottom') {
      const isScrolling = setInterval(function () {
        managerContent.scrollTop += 4;
      }, 10);
      setTimerIdScroll(isScrolling);
    }
    else if (isAllowScroll === 'top') {
      const isScrolling = setInterval(function () {
        managerContent.scrollTop -= 4;
      }, 10);
      setTimerIdScroll(isScrolling);
    }
    else if (!isAllowScroll) {
      clearInterval(timerIdScroll);
      setTimerIdScroll(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAllowScroll]);

  const autoscroll = (clientY) => {
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
  };

  const dragStartFolder = (currentElement, offsetLeft, offsetTop, index, type, folders) => {
    const height = currentElement.offsetHeight;
    // const widht = currentElement.offsetWidth;

    currentElement.style.width = `50%`;
    currentElement.style.height = `${height}px`;
    currentElement.style.position = 'absolute';
    currentElement.style.left = `${offsetLeft}px`;
    currentElement.style.top = `${offsetTop}px`;
    currentElement.style.backgroundColor = 'transparent';
    currentElement.style.opacity = 0.5;
    currentElement.style.zIndex = 99;

    if (folders.length === 1) {
      document.getElementById(type).style.paddingBottom = `${height}px`;
    }
    else {
      if (index === 0) {
        const nextElementId = folders[index + 1].id;
        document.getElementById(nextElementId).style.marginLeft = `50%`;
        setPlaceholderId(nextElementId);
      }
      else if (index === folders.length - 1) {
        if (index % 2 === 0) {
          document.getElementById(type).style.paddingBottom = `${height}px`;
        }
        else if (index % 2 !== 0) {
          const prevElementId = folders[index - 1].id;
          document.getElementById(prevElementId).style.marginRight = `50%`;
          setPlaceholderId(prevElementId);
        }
      }
      else {
        if (index % 2 === 0) {
          const nextElement = folders[index + 1].id;
          document.getElementById(nextElement).style.marginLeft = `50%`;
          setPlaceholderId(nextElement);
        }
        else if (index % 2 !== 0) {
          const prevElementId = folders[index - 1].id;
          document.getElementById(prevElementId).style.marginRight = `50%`;
          setPlaceholderId(prevElementId);
        }
      }
    }
  };

  const dragStartUniversal = (currentElement, offsetLeft, offsetTop, index, type, contentArray) => {
    const height = currentElement.offsetHeight;
    // const widht = currentElement.offsetWidth;

    // currentElement.style.width = `${widht}px`;
    // currentElement.style.height = `${height}px`;
    currentElement.style.position = 'absolute';
    currentElement.style.left = `${offsetLeft}px`;
    currentElement.style.top = `${offsetTop}px`;
    currentElement.style.backgroundColor = 'transparent';
    currentElement.style.opacity = 0.5;
    currentElement.style.zIndex = 99;

    if (contentArray.length === 1) {
      document.getElementById(type).style.paddingBottom = `${height}px`;
    }
    else {
      if (index === contentArray.length - 1) {
        document.getElementById(contentArray[contentArray.length - 2].id).style.marginBottom = `${height}px`;
        setPlaceholderId(contentArray[contentArray.length - 2].id);
      }
      else {
        document.getElementById(contentArray[index + 1].id).style.marginTop = `${height}px`;
        setPlaceholderId(contentArray[index + 1].id);
      }
    }
  };

  const dragStartOpenModal = (e, index, id, name, type, openSettingsModal, currentElement, contentArray) => {
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
      setPreventOnClick(false);
    }, 500);
    setTimerIdSettings(timerOpenModal);
  };

  const dragStart = (e, index, id, type, name, openSettingsModal) => {
    const currentElement = e.currentTarget;

    const timerDragStart = setTimeout(() => {
      setIsDraggable(true);
      setPreventOnClick(true);
      setDraggable({ index, id, type });

      const clientX = e.clientX || e.touches[0].clientX;
      const clientY = e.clientY || e.touches[0].clientY;
      const offsetLeft = currentElement.getBoundingClientRect().left;
      const offsetTop = currentElement.getBoundingClientRect().top;
      const offsetX = clientX - offsetLeft;
      const offsetY = clientY - offsetTop;

      setDraggableOffsetX(offsetX);
      setDraggableOffsetY(offsetY);

      if (type === 'folder') {
        dragStartFolder(currentElement, offsetLeft, offsetTop, index, type, folder[`${type}s`]);
      }
      else {
        dragStartUniversal(currentElement, offsetLeft, offsetTop, index, type, folder[`${type}s`]);
      }

      if (type !== 'task' && windowWidth < 639) dragStartOpenModal(e, index, id, name, type, openSettingsModal, currentElement, folder[`${type}s`]);
    }, 200);
    setTimerIdDrag(timerDragStart);
  };

  const dragMoveFolderFirstTime = (
    element,
    height,
    widht,
    index,
    id,
    prevFolderId,
    nextFolderId,
    lastFolderIndex
  ) => {
    if (draggable.index < index) {
      if (index % 2 === 0) {
        if (index === lastFolderIndex) {
          document.getElementById(draggable.type).style.paddingBottom = `${height}px`;
        }
        else {
          document.getElementById(nextFolderId).style.marginLeft = `${widht}px`;
          setPlaceholderId(nextFolderId);
        }

        setPlaceholderPosition('left');
      }
      else if (index % 2 !== 0) {
        document.getElementById(draggable.type).style.paddingBottom = `initial`;
        element.style.marginRight = `${widht}px`;
        setPlaceholderId(id);
        setPlaceholderPosition('right');
      }
    }
    else if (draggable.index > index) {
      if (index % 2 === 0) {
        document.getElementById(draggable.type).style.paddingBottom = 'initial';
        element.style.marginLeft = `${widht}px`;
        setPlaceholderId(id);
        setPlaceholderPosition('left');
      }
      else if (index % 2 !== 0) {
        document.getElementById(draggable.type).style.paddingBottom = 'initial';
        document.getElementById(prevFolderId).style.marginRight = `${widht}px`;
        setPlaceholderId(prevFolderId);
        setPlaceholderPosition('right');
      }
    }
  };

  const dragMoveFolderSecondTime = (
    element,
    height,
    width,
    index,
    id,
    prevFolderId,
    prevPrevFolderId,
    nextFolderId,
    nextNextFolderId,
    lastFolderIndex
  ) => {
    if (draggable.index < index) {
      if (placeholderPosition === 'right') {
        if (index % 2 === 0) {
          if (index === lastFolderIndex) {
            document.getElementById(draggable.type).style.paddingBottom = `${height}px`;
          }
          else {
            document.getElementById(prevPrevFolderId).style.marginLeft = `${width}px`;
            setPlaceholderId(prevPrevFolderId);
          }

          setPlaceholderPosition('left');
        }
        else if (index % 2 !== 0) {
          element.style.marginLeft = `${width}px`;
          setPlaceholderId(id);
          setPlaceholderPosition('left');
        }
      }
      else if (placeholderPosition === 'left') {
        if (index % 2 === 0) {
          if (draggable.index + 1 === index) {
            document.getElementById(draggable.type).style.paddingBottom = `initial`;
            document.getElementById(prevPrevFolderId).style.marginRight = `${width}px`;
            setPlaceholderId(prevPrevFolderId);
          }
          else {
            document.getElementById(draggable.type).style.paddingBottom = `initial`;
            document.getElementById(prevFolderId).style.marginRight = `${width}px`;
            setPlaceholderId(prevFolderId);
          }

          setPlaceholderPosition('right');
        }
        else if (index % 2 !== 0) {
          element.style.marginRight = `${width}px`;
          setPlaceholderId(id);
          setPlaceholderPosition('right');
        }
      }
    }
    else if (draggable.index > index) {
      if (placeholderPosition === 'right') {
        if (index % 2 === 0) {
          element.style.marginLeft = `${width}px`;
          setPlaceholderId(id);
          setPlaceholderPosition('left');
        }
        else if (index % 2 !== 0) {
          if (draggable.index === lastFolderIndex) {
            // document.getElementById(nextFolderId).style.marginLeft = `${width}px`;
            document.getElementById(draggable.type).style.paddingBottom = `${height}px`;
            setPlaceholderId(nextFolderId);
            setPlaceholderPosition('left');
          }
          else {
            if (draggable.index - 1 === index) {
              document.getElementById(nextNextFolderId).style.marginLeft = `${width}px`;
              setPlaceholderId(nextNextFolderId);
              setPlaceholderPosition('left');
            }
            else {
              document.getElementById(nextFolderId).style.marginLeft = `${width}px`;
              setPlaceholderId(nextFolderId);
              setPlaceholderPosition('left');
            }
          }
        }
      }
      else if (placeholderPosition === 'left') {
        if (index % 2 === 0) {
          element.style.marginRight = `${width}px`;
          setPlaceholderId(id);
          setPlaceholderPosition('right');
        }
        else if (index % 2 !== 0) {
          document.getElementById(draggable.type).style.paddingBottom = 'initial';
          document.getElementById(prevFolderId).style.marginRight = `${width}px`;
          setPlaceholderId(prevFolderId);
          setPlaceholderPosition('right');
        }
      }
    }
  };

  const dragMoveFolder = (targetElement, targetElementIndex, targetElementId) => {
    const timerMoveFolder = setTimeout(() => {
      if (placeholderId) document.getElementById(placeholderId).style.margin = 'initial';

      const height = targetElement.offsetHeight;
      const widht = targetElement.offsetWidth;
      const prevFolderId = folder?.folders[targetElementIndex - 1]?.id;
      const prevPrevFolderId = folder?.folders[targetElementIndex - 2]?.id;
      const nextFolderId = folder?.folders[targetElementIndex + 1]?.id;
      const nextNextFolderId = folder?.folders[targetElementIndex + 2]?.id;
      const lastFolderIndex = folder?.folders?.length - 1;

      if (target?.index !== targetElementIndex) {
        dragMoveFolderFirstTime(targetElement, height, widht, targetElementIndex, targetElementId, prevFolderId, nextFolderId, lastFolderIndex);
      }
      else {
        dragMoveFolderSecondTime(targetElement, height, widht, targetElementIndex, targetElementId, prevFolderId, prevPrevFolderId, nextFolderId, nextNextFolderId, lastFolderIndex);
      }

      setIsAllowNest(true);
      setNestFolderId(null);
    }, 500);
    setTimerIdNest(timerMoveFolder);
  };

  const dragMoveUniversalFirstTime = (element, index, id, height) => {
    if (draggable.index < index) {
      element.style.marginBottom = `${height}px`;
      setPlaceholderId(id);
      setPlaceholderPosition('bottom');
    }
    else if (draggable.index > index) {
      element.style.marginTop = `${height}px`;
      setPlaceholderId(id);
      setPlaceholderPosition('top');
    }
  };

  const dragMoveUniversalSecondTime = (element, index, id, height) => {
    if (draggable.index < index) {
      if (placeholderPosition === 'bottom') {
        element.style.marginTop = `${height}px`;
        setPlaceholderId(id);
        setPlaceholderPosition('top');
      }
      else if (placeholderPosition === 'top') {
        element.style.marginBottom = `${height}px`;
        setPlaceholderId(id);
        setPlaceholderPosition('bottom');
      }
    }
    else if (draggable.index > index) {
      if (placeholderPosition === 'bottom') {
        element.style.marginTop = `${height}px`;
        setPlaceholderId(id);
        setPlaceholderPosition('top');
      }
      else if (placeholderPosition === 'top') {
        element.style.marginBottom = `${height}px`;
        setPlaceholderId(id);
        setPlaceholderPosition('bottom');
      }
    }
  };

  const dragMoveUniversal = (targetElement, targetElementIndex, targetElementId) => {
    if (placeholderId) document.getElementById(placeholderId).style.margin = 'initial';

    const height = targetElement.offsetHeight;

    if (target?.index !== targetElementIndex) {
      dragMoveUniversalFirstTime(targetElement, targetElementIndex, targetElementId, height);
    }
    else {
      dragMoveUniversalSecondTime(targetElement, targetElementIndex, targetElementId, height);
    }
  };

  const dragMove = (e) => {
    clearTimeout(timerIdDragStart);
    clearTimeout(timerIdSettings);

    if (isDraggable) {
      const currentElement = e.currentTarget;
      const clientX = e.clientX || e.touches[0].clientX;
      const clientY = e.clientY || e.touches[0].clientY;

      currentElement.style.left = `${clientX - draggableOffsetX}px`;
      currentElement.style.top = `${clientY - draggableOffsetY}px`;

      // STEP 2: Autoscroll
      autoscroll(clientY);

      // STEP 3: Get target element
      document.elementsFromPoint(clientX, clientY).forEach(i => {
        const targetElementIndex = Number(i.getAttribute('data-index'));
        const targetElementId = i.getAttribute('data-id');
        const targetElementType = i.getAttribute('data-type');

        if (targetElementType === 'navigation') {
          setTarget({ ...target, type: 'navigation' });
          return;
        };

        if (targetElementId && targetElementId !== draggable.id) {
          setTarget({
            index: targetElementIndex,
            id: targetElementId,
            type: targetElementType
          });

          const targetElement = document.getElementById(targetElementId);

          if (draggable.type === 'folder' && targetElementType === 'folder') {
            if (isAllowNest) {
              setIsAllowNest(false);
              setNestFolderId(targetElementId);

              dragMoveFolder(targetElement, targetElementIndex, targetElementId);
            }
            else if (!isAllowNest && nestFolderId && nestFolderId !== targetElementId) {
              clearTimeout(timerIdNest);
              setIsAllowNest(false);
              setNestFolderId(targetElementId);

              dragMoveFolder(targetElement, targetElementIndex, targetElementId);
            }
          }
          else if (draggable.type === 'note' && targetElementType === 'note') {
            dragMoveUniversal(targetElement, targetElementIndex, targetElementId);
          }
          else if (draggable.type === 'task' && targetElementType === 'task') {
            dragMoveUniversal(targetElement, targetElementIndex, targetElementId);
          }
        }
      });
    }
  };

  const dragEndFolder = () => {
    let newFolders;

    if (draggable?.index < target?.index) {
      const foldersCopy = folder.folders;
      const draggableFolder = foldersCopy[draggable?.index];
      const targetFolder = foldersCopy[target?.index];

      const beforeDraggable = foldersCopy.slice(0, draggable?.index);
      const elementsBetween = foldersCopy.slice(Number(draggable?.index) + 1, target?.index);
      const afterTarget = foldersCopy.slice(Number(target?.index) + 1);

      if (target?.index % 2 === 0) {
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
      else if (target?.index % 2 !== 0) {
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
    }
    else {
      const foldersCopy = folder.folders;
      const draggableFolder = foldersCopy[draggable?.index];
      const targetFolder = foldersCopy[target?.index];

      const afterDraggable = foldersCopy.slice(Number(draggable?.index) + 1);
      const elementsBetween = foldersCopy.slice(Number(target?.index) + 1, draggable?.index);
      const beforeTarget = foldersCopy.slice(0, target?.index);

      if (target?.index % 2 === 0) {
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
      else if (target?.index % 2 !== 0) {
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
    }

    dispatch(moveFolder({ newFolders }));
  };

  const dragEndUniversal = () => {
    let newObj;

    const draggableTypeArrayCopy = folder[`${draggable?.type}s`];
    const draggableElement = draggableTypeArrayCopy[draggable?.index];
    const targetElement = draggableTypeArrayCopy[target?.index];

    if (draggable?.index < target?.index) {
      const beforeDraggable = draggableTypeArrayCopy.slice(0, draggable?.index);
      const elementsBetween = draggableTypeArrayCopy.slice(Number(draggable?.index) + 1, target?.index);
      const afterTarget = draggableTypeArrayCopy.slice(Number(target?.index) + 1);

      if (placeholderPosition === 'top') {
        newObj = [
          ...beforeDraggable,
          ...elementsBetween,
          draggableElement,
          targetElement,
          ...afterTarget
        ];
      }
      else if (placeholderPosition === 'bottom') {
        newObj = [
          ...beforeDraggable,
          ...elementsBetween,
          targetElement,
          draggableElement,
          ...afterTarget
        ];
      }
    }
    else if (draggable?.index > target?.index) {
      const afterDraggable = draggableTypeArrayCopy.slice(Number(draggable?.index) + 1);
      const elementsBetween = draggableTypeArrayCopy.slice(Number(target?.index) + 1, draggable?.index);
      const beforeTarget = draggableTypeArrayCopy.slice(0, target?.index);

      if (placeholderPosition === 'top') {
        newObj = [
          ...beforeTarget,
          draggableElement,
          targetElement,
          ...elementsBetween,
          ...afterDraggable
        ];
      }
      else if (placeholderPosition === 'bottom') {
        newObj = [
          ...beforeTarget,
          targetElement,
          draggableElement,
          ...elementsBetween,
          ...afterDraggable
        ];
      }
    }

    dispatch(moveUniversal({ newObj, type: `${draggable.type}s` }));
  };

  const dragEnd = (e) => {
    clearTimeout(timerIdDragStart);
    clearTimeout(timerIdSettings);
    clearTimeout(timerIdNest);
    setIsAllowNest(true);
    setIsAllowScroll(false);

    if (isDraggable) {
      e.currentTarget.style.width = 'initial';
      e.currentTarget.style.height = 'initial';
      e.currentTarget.style.position = 'initial';
      e.currentTarget.style.backgroundColor = 'initial';
      e.currentTarget.style.opacity = 'initial';
      e.currentTarget.style.zIndex = 'initial';

      document.getElementById(draggable.type).style.paddingBottom = `initial`;

      if (placeholderId) {
        document.getElementById(placeholderId).style.margin = '0px';
        setPlaceholderId(null);
      }

      if (target?.type === 'navigation') {
        dispatch(moveFromFolder({ folder, index: draggable.index, type: `${draggable.type}s` }));
      }
      else if (!isAllowNest && target?.index !== null) {
        dispatch(moveInFolder({ folder, targetIndex: target?.index, draggableIndex: draggable?.index, type: `${draggable.type}s` }));
      }
      else if (draggable?.type === 'folder' && target?.type === 'folder' && target?.index !== null) {
        dragEndFolder();
      }
      else if (draggable?.type === 'note' && target?.type === 'note' && target?.index !== null) {
        dragEndUniversal();
      }
      else if (draggable?.type === 'task' && target?.type === 'task' && target?.index !== null) {
        dragEndUniversal();
      }
      else if ((draggable?.type === 'note' || 'task') && target?.type === 'folder' && target?.index !== null) {
        dispatch(moveInFolder({ folder, targetIndex: target?.index, draggableIndex: draggable?.index, type: `${draggable.type}s` }));
      }

      setIsDraggable(false);
      setDraggableOffsetX(null);
      setDraggableOffsetY(null);
      setDraggable(null);
      setTarget(null);
      setPlaceholderId(null);
      setPlaceholderPosition(null);

      setTimeout(() => setPreventOnClick(false), 0);
    }
  };

  return (
    <DragAndDropContext.Provider value={{
      isDraggable,
      preventOnClick,
      dragStart,
      dragMove,
      dragEnd,
    }}>
      {children}
    </DragAndDropContext.Provider>
  );
};
