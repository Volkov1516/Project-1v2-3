import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveTaskId, updateInDocuments, deleteFromDocuments } from 'redux/features/user/userSlice';

import { IconButton } from 'components/IconButton/IconButton';

import { useDragAndDrop } from 'components/DragAndDrop/DragAndDropContext';

import css from './Task.module.css';

export const Task = ({ id, content }) => {
  const { isDraggable } = useDragAndDrop();

  const dispatch = useDispatch();

  const { activeTaskId } = useSelector(state => state.user);

  const contentEditableRef = useRef(null);

  const [initialContent, setInitialContent] = useState('');

  useEffect(() => {
    if (contentEditableRef.current && id === activeTaskId) {
      contentEditableRef.current.focus();
    }
  }, [id, activeTaskId]);


  const handleOnClick = e => setInitialContent(e.target.innerText);

  const handleOnBlur = async e => {
    if (!e.target.innerText) {
      handleDeleteTask();
    }
    else if (initialContent === e.target.innerText) {
      return;
    }
    else {
      dispatch(updateInDocuments({ type: 'tasks', id, name: 'content', value: e.target.innerText }));
    }

    setInitialContent('');
    dispatch(setActiveTaskId(null));
  };

  const handleDeleteTask = () => dispatch(deleteFromDocuments({ type: 'tasks', id }));

  const handleOnKeyDown = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.target.blur();
    }
  };

  return (
    <div className={css.container}>
      <IconButton onClick={handleDeleteTask} path="M480.134-120q-74.673 0-140.41-28.339-65.737-28.34-114.365-76.922-48.627-48.582-76.993-114.257Q120-405.194 120-479.866q0-74.673 28.339-140.41 28.34-65.737 76.922-114.365 48.582-48.627 114.257-76.993Q405.194-840 479.866-840q74.673 0 140.41 28.339 65.737 28.34 114.365 76.922 48.627 48.582 76.993 114.257Q840-554.806 840-480.134q0 74.673-28.339 140.41-28.34 65.737-76.922 114.365-48.582 48.627-114.257 76.993Q554.806-120 480.134-120ZM480-160q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
      <div
        ref={contentEditableRef}
        className={css.content}
        contentEditable={!isDraggable}
        suppressContentEditableWarning={true}
        onClick={handleOnClick}
        onBlur={handleOnBlur}
        onKeyDown={handleOnKeyDown}
      >
        {content}
      </div>
    </div>
  );
};
