import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { dndSwap, dndInside, dndOutside,  setActiveTaskId, updateInDocuments, deleteFromDocuments, updateTaskStatus } from 'redux/features/user/userSlice';
import Sortable from 'sortablejs';

import { IconButton } from 'components';

import css from './Tasks.module.css';

import { BIN, CLOSE } from 'utils/variables';

export const Tasks = ({ tasks }) => {
  const dispatch = useDispatch();

  const { activeTaskId } = useSelector(state => state.user);

  const textRef = useRef(null);
  const containerRef = useRef(null);
  const holdTimeout = useRef(null);

  const [initialContent, setInitialContent] = useState(null);
  const [statusMenu, setStatusMenu] = useState(null);

  useEffect(() => {
    if (activeTaskId) {
      const container = document.getElementById(activeTaskId);
      const targetDiv = container?.children[1];

      if (targetDiv && targetDiv.contentEditable) {
        targetDiv.focus();
      }
    }
  }, [tasks, activeTaskId]);

  useEffect(() => {
    if (containerRef.current) {
      const sortable = new Sortable(containerRef.current, {
        animation: 200,
        delay: 200,
        delayOnTouchOnly: true,
        scroll: true,
        scrollSensitivity: 100,
        ghostClass: `${css.placeholder}`,
        onStart: () => {
          clearTimeout(holdTimeout.current);
        },
        onEnd: (e) => {
          let x, y;

          if (e.originalEvent instanceof MouseEvent) {
            x = e.originalEvent.clientX;
            y = e.originalEvent.clientY;
          }
          else if (e.originalEvent instanceof TouchEvent && e.originalEvent.changedTouches.length > 0) {
            x = e.originalEvent.changedTouches[0].clientX;
            y = e.originalEvent.changedTouches[0].clientY;
          }

          const elementFromPoint = document.elementFromPoint(x, y);
          const containerRect = containerRef.current.getBoundingClientRect();
          const isOutside = x < containerRect.left || x > containerRect.right || y < containerRect.top || y > containerRect.bottom;
          const targetElementId = elementFromPoint.getAttribute('data-id');
          const targetElementType = elementFromPoint.getAttribute('data-type');

          if (isOutside && targetElementType !== 'navigation' && targetElementType !== 'folder') {
            return;
          }
          else if (isOutside && targetElementType === 'navigation') {
            dispatch(dndOutside({ type: 'tasks', items: tasks, oldIndex: e.oldIndex }));
          }
          else if (isOutside && targetElementType === 'folder') {
            dispatch(dndInside({ type: 'tasks', items: tasks, oldIndex: e.oldIndex, newFolderId: targetElementId }));
          }
          else {
            dispatch(dndSwap({ type: 'tasks', items: tasks, oldIndex: e.oldIndex, newIndex: e.newIndex }));
          }
        }
      });

      return () => sortable && sortable.destroy();
    }
  }, [dispatch, tasks]);

  const handleTouchStart = e => e.currentTarget.classList.add(css.touch);

  const handleTouchEnd = e => e.currentTarget.classList.remove(css.touch);

  const handleOnClick = e => setInitialContent(e.target.innerText);

  const handleOnKeyDown = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.target.blur();
    }
  };

  const handleOnBlur = async (e, id) => {
    if (!e.target.innerText) {
      dispatch(deleteFromDocuments({ type: 'tasks', id }));
    }
    else if (initialContent === e.target.innerText) {
      return;
    }
    else {
      dispatch(updateInDocuments({ type: 'tasks', id, name: 'content', value: e.target.innerText }));
    }

    setInitialContent(null);
    dispatch(setActiveTaskId(null));
  };

  const handleStatusMenuOpen = (id) => {
    setStatusMenu(id);
  };

  const handleStatusMenuClose = (e) => {
    e.stopPropagation();
    setStatusMenu(false);
  };

  const handleStatusMenuCheck = (e, id, status) => {
    e.stopPropagation();
    dispatch(updateTaskStatus({ id, status }));

    dispatch(setActiveTaskId(null));
    setStatusMenu(false);
  };

  const handleStatusMenuDelete = (e, id) => {
    handleOnBlur(e, id);
  };

  return (
    <div ref={containerRef} id="task" className={css.conatiner}>
      {tasks?.map(i => (
        <div id={i.id} key={i.id} className={css.task}>
          <div
            className={css.checkboxContainer}
            onClick={(e) => handleStatusMenuOpen(i.id)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className={`
                ${css.checkbox} 
                ${i.status === "checked" && css.checked} 
                ${i.status === "halfchecked" && css.halfchecked}
                ${i.status === "unchecked" && css.unchecked}
              `} />
            {statusMenu && statusMenu === i.id && (
              <div className={css.statusMenu}>
                <div className={css.statusMenuItemCloseWrapper}>
                  <IconButton variant="secondary" path={CLOSE} onClick={handleStatusMenuClose} />
                </div>
                <div
                  className={css.statusMenuItemWrapper}
                  onClick={(e) => handleStatusMenuCheck(e, i.id, "unchecked")}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                >
                  <div className={css.statusMenuItemUnchecked} />
                </div>
                <div
                  className={css.statusMenuItemWrapper}
                  onClick={(e) => handleStatusMenuCheck(e, i.id, "halfchecked")}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                >
                  <div className={css.statusMenuItemHalfchecked} />
                </div>
                <div
                  className={css.statusMenuItemWrapper}
                  onClick={(e) => handleStatusMenuCheck(e, i.id, "checked")}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                >
                  <div className={css.statusMenuItemChecked} />
                </div>
                <IconButton variant="tooltip" path={BIN} onClick={(e) => handleStatusMenuDelete(e, i.id)} />
              </div>
            )}
          </div>
          <div
            ref={textRef}
            className={`
                ${css.text} 
                ${i.status === "checked" && css.checked} 
                ${i.status === "halfchecked" && css.halfchecked}
                ${i.status === "unchecked" && css.unchecked}
              `}
            // contentEditable={!isDraggable}
            contentEditable={true}
            suppressContentEditableWarning={true}
            onClick={handleOnClick}
            onKeyDown={handleOnKeyDown}
            onBlur={(e) => handleOnBlur(e, i.id)}
          >
            {i.content}
          </div>
        </div>
      ))}
    </div>
  );
};
