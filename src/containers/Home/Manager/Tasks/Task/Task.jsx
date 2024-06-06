import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveTaskId, updateInDocuments, deleteFromDocuments } from 'redux/features/user/userSlice';

import { IconButton } from 'components/IconButton/IconButton';
import { Tooltip } from 'components/Tooltip/Tooltip';
import { useDragAndDrop } from 'components/DragAndDrop/DragAndDropContext';

import css from './Task.module.css';

import { CIRCLE } from 'utils/variables';

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
      <Tooltip content="Complete">
        <IconButton variant="secondary" path={CIRCLE} onClick={handleDeleteTask} />
      </Tooltip>
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
