import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setNoteModal, setLockEditor } from 'redux/features/app/appSlice';
import { setActiveNote } from 'redux/features/note/noteSlice';

import { IconButton } from 'components/IconButton/IconButton';
import { Tooltip } from 'components/Tooltip/Tooltip';

import css from './Header.module.css';

import { EXPAND, ARROW_BACK, CLOUD, LOCK, UNLOCK, CLOSE } from 'utils/variables';

export const Header = ({ containerRef }) => {
  const dispatch = useDispatch();

  const { windowWidth, lockEditor } = useSelector(state => state.app);
  const { isNewNote } = useSelector(state => state.note);

  const [expanded, setExpanded] = useState(null);

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

  return (
    <div className={css.container}>
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
        {!isNewNote && <Tooltip preferablePosition="bottom" content="Sycn"><IconButton variant="secondary" path={CLOUD} /></Tooltip>}
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
