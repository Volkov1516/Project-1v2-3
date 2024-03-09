import { memo, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { FolderNavigation } from './FolderNavigation/FolderNavigation';
import { Folders } from './Folders/Folders';
import { Notes } from './Notes/Notes';
import { Tasks } from './Tasks/Tasks';

import css from './Content.module.css';

export const Content = memo(function MemoizedContent({
  mouseTimer,
  isDraggable,
  setIsDraggable,
  setDraggableId,
  setDraggableIndex,
  setDraggableOffsetX,
  setDraggableOffsetY,
}) {
  let pointerTimer;

  const { documents, path } = useSelector(state => state.user);

  const [folder, setFolder] = useState(null);

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

      return null;
    }

    let res = findFolder(documents, path[path.length - 1]);
    setFolder(res);
  }, [documents, path]);



  const handleOnPointerDown = (e, index, id) => {
    pointerTimer = setTimeout(() => {
      e.preventDefault();

      // STEP 1: Get draggable element props
      setIsDraggable(true);
      setDraggableIndex(index);
      setDraggableId(id);

      // STEP 2: Remove draggable element from the list and make it following the pointer
      const draggableElement = document.getElementById(id);

      // Положение указателя относительно верхнего левого угла draggable
      const offsetX = e.clientX - draggableElement.getBoundingClientRect().left;
      const offsetY = e.clientY - draggableElement.getBoundingClientRect().top;

      setDraggableOffsetX(offsetX);
      setDraggableOffsetY(offsetY);

      draggableElement.style.touchAction = 'none';
      draggableElement.style.position = 'absolute';
      draggableElement.style.left = (e.clientX - offsetX) + 'px';
      draggableElement.style.top = (e.clientY - offsetY) + 'px';
      draggableElement.style.backgroundColor = 'gray';
      draggableElement.style.opacity = 0.5;
      draggableElement.style.zIndex = -0;
    }, 200);


    // const newDocuments = JSON.parse(JSON.stringify(documents));

    // const getSiblingPosition = (targetFolder) => {
    //   const next = targetFolder.folders[index + 1];

    //   setPrevMargin(next.id);
    //   const nextElement = document.getElementById(next.id);
    //   nextElement.style.marginTop = '34px';
    //   // nextElement.style.marginLeft = '50%';
    // };

    // findFolder(newDocuments, path[path.length - 1], getSiblingPosition);
  };

  const handleOnPointerMove = (e, index, id) => {
    e.preventDefault();

    // clearTimeout(pointerTimer);
    console.log('pointer move');
  };

  const handleOnPointerUp = (e, index, id) => {
    e.preventDefault();

    clearTimeout(pointerTimer);
    console.log('pointer up');

    const draggableElement = document.getElementById(id);
    draggableElement.style.touchAction = 'auto';
  };

  return (
    <div className={css.container} onScroll={() => clearTimeout(pointerTimer)}>
      <FolderNavigation name={folder?.name} />
      <Folders
        folders={folder?.folders}
        isDraggable={isDraggable}
        onPointerDown={handleOnPointerDown}
        onPointerUp={handleOnPointerUp}
        onPointerMove={handleOnPointerMove}
      />
      <Notes notes={folder?.notes} />
      <Tasks tasks={folder?.tasks} />
    </div>
  );
});
