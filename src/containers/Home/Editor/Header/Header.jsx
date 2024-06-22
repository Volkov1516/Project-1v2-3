import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setNoteModal, setLockEditor } from 'redux/features/app/appSlice';
import { setActiveNote, setCanUndo, setCanRedo } from 'redux/features/note/noteSlice';
import { UNDO_COMMAND, REDO_COMMAND } from 'lexical';

import { IconButton } from 'components/IconButton/IconButton';
import { Tooltip } from 'components/Tooltip/Tooltip';

import css from './Header.module.css';

import { EXPAND, ARROW_BACK, UNDO, REDO, LOCK, UNLOCK, CLOSE } from 'utils/variables';

export const Header = ({ containerRef, editor }) => {
  const dispatch = useDispatch();

  const { windowWidth, lockEditor } = useSelector(state => state.app);
  const { isNewNote, canUndo, canRedo } = useSelector(state => state.note);

  const headerRef = useRef(null);

  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const updateBottomOffset = () => {
      if (window.visualViewport) {
        // headerRef.current.style.bottom = `${window.visualViewport.height - window.innerHeight}px`;
        headerRef.current.style.bottom = (window.innerHeight - window.visualViewport.height - window.visualViewport.offsetTop) + 'px';
      }
    };

    updateBottomOffset();
    window.visualViewport.addEventListener('resize', updateBottomOffset);
    window.visualViewport.addEventListener('scroll', updateBottomOffset);

    return () => {
      window.visualViewport.removeEventListener('resize', updateBottomOffset);
      window.visualViewport.removeEventListener('scroll', updateBottomOffset);
    };
  }, []);

  const handleClose = () => {
    if (windowWidth <= 480) {
      window.history.back();
    }
    else {
      dispatch(setActiveNote({
        isNew: null,
        id: null,
        title: null,
        content: null
      }));
      dispatch(setNoteModal(false));
    }

    dispatch(setCanUndo(false));
    dispatch(setCanRedo(false));
  };

  const handleExpand = () => {
    if (containerRef) {
      if (expanded) {
        containerRef.current.style.width = 'calc(100vw - 298px)';
      }
      else {
        containerRef.current.style.width = '100vw';
      }

      setExpanded(!expanded);
    }
  };

  const handleUndo = () => {
    if (editor) {
      editor.dispatchCommand(UNDO_COMMAND, undefined);
    }
  };

  const handleRedo = () => {
    if (editor) {
      editor.dispatchCommand(REDO_COMMAND, undefined);
    }
  };

  return (
    <div ref={headerRef} className={css.container}>
      <div className={css.start}>
        <Tooltip preferablePosition="bottom" content={expanded ? "Collapse" : "Expand"}>
          <div className={`${css.expand} ${!expanded && css.rotateArrow}`}>
            <IconButton variant="secondary" path={EXPAND} onClick={handleExpand} />
          </div>
        </Tooltip>
        <div className={css.arrowBack}>
          <IconButton variant="secondary" path={ARROW_BACK} onClick={handleClose} />
        </div>
      </div>
      <div className={css.end}>
        <Tooltip preferablePosition="bottom" content="Undo">
          <IconButton variant="secondary" path={UNDO} isDisabled={!canUndo} onClick={handleUndo} />
        </Tooltip>
        <Tooltip preferablePosition="bottom" content="Redo">
          <IconButton variant="secondary" path={REDO} isDisabled={!canRedo} onClick={handleRedo} />
        </Tooltip>
        {!isNewNote && lockEditor
          ? <Tooltip preferablePosition="bottom" content="Unlock"><IconButton variant="secondary" path={LOCK} onClick={() => dispatch(setLockEditor(false))} /></Tooltip>
          : <Tooltip preferablePosition="bottom" content="Lock"><IconButton variant="secondary" path={UNLOCK} onClick={() => dispatch(setLockEditor(true))} /></Tooltip>
        }
        <div className={css.close}>
          <Tooltip preferablePosition="bottom" content="Close">
            <IconButton variant="secondary" path={CLOSE} onClick={handleClose} />
          </Tooltip>
        </div>
      </div>
    </div>
  );
};
