import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from 'redux/features/app/appSlice';
import { updateDocuments } from 'redux/features/user/userSlice';

import { Bar } from './Bar/Bar';
import { Content } from './Content/Content';
import { EditorModal } from './EditorModal/EditorModal';
import { Snackbar } from 'components/atoms/Snackbar/Snackbar';

import css from './Home.module.css';

import { findFolder } from 'utils/findFolder';

export const Home = () => {
  const dispatch = useDispatch();

  const { documents, path } = useSelector(state => state.user);

  const [isDraggable, setIsDraggable] = useState(false);
  const [draggableId, setDraggableId] = useState(null);
  const [draggableIndex, setDraggableIndex] = useState(null);
  const [draggableOffsetX, setDraggableOffsetX] = useState(null);
  const [draggableOffsetY, setDraggableOffsetY] = useState(null);
  const [targetIndex, setTargetIndex] = useState(null);


  useEffect(() => {
    const body = document.body;
    const theme = localStorage.getItem('theme');

    if (theme) {
      if (theme === 'light') {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');

        dispatch(setTheme('light'));
      }
      else if (theme === 'dark') {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');

        dispatch(setTheme('dark'));
      }
    }
    else {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        dispatch(setTheme('dark'));
      } else {
        dispatch(setTheme('light'));
      }
    }
  }, [dispatch]);

  let mouseTimer;

  const onMouseUp = () => mouseTimer && window.clearTimeout(mouseTimer);

  const handlePointerMove = (e) => {
    e.preventDefault();

    if (isDraggable) {
      const draggableElement = document.getElementById(draggableId);
      let x = e.clientX - draggableOffsetX;
      let y = e.clientY - draggableOffsetY;
      draggableElement.style.left = x + 'px';
      draggableElement.style.top = y + 'px';


      const elementBelow = document?.elementFromPoint(e.clientX, e.clientY);
      setTargetIndex(elementBelow?.getAttribute('data-index'));
    }
  };

  const handleOnPointerUp = (e) => {
    e.preventDefault();

    if (isDraggable) {
      const draggableElement = document.getElementById(draggableId);
      draggableElement.style.position = 'initial';
      draggableElement.style.left = 'initial';
      draggableElement.style.top = 'initial';
      draggableElement.style.backgroundColor = 'initial';
      draggableElement.style.opacity = 1;

      const newDocuments = JSON.parse(JSON.stringify(documents));

      const changeFolderPosition = (targetFolder) => {
        const folderCopy = targetFolder.folders;
        const filteredFolderItem = folderCopy.splice(draggableIndex, 1);

        const newFolders = [
          ...folderCopy.slice(0, targetIndex),
          ...filteredFolderItem,
          ...folderCopy.slice(targetIndex)
        ];

        targetFolder.folders = newFolders;
      };

      findFolder(newDocuments, path[path.length - 1], changeFolderPosition);
      dispatch(updateDocuments(newDocuments));
    }

    setIsDraggable(false);
  };

  return (
    <div className={css.container} onScroll={onMouseUp} onPointerMove={handlePointerMove} onPointerUp={handleOnPointerUp}>
      <Bar />
      <Content
        mouseTimer={mouseTimer}
        isDraggable={isDraggable}
        setIsDraggable={setIsDraggable}
        draggableId={draggableId}
        setDraggableId={setDraggableId}
        draggableIndex={draggableIndex}
        setDraggableIndex={setDraggableIndex}
        draggableOffsetX={draggableOffsetX}
        setDraggableOffsetX={setDraggableOffsetX}
        draggableOffsetY={draggableOffsetY}
        setDraggableOffsetY={setDraggableOffsetY}
      />
      <EditorModal />
      <Snackbar />
    </div>
  );
};
