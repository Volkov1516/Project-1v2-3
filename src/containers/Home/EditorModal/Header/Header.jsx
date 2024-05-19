import { useState } from 'react';
import { useSelector } from 'react-redux';

import { IconButton } from 'components/IconButton/IconButton';

import css from './Header.module.css';

import { EXPAND, ARROW_BACK, CLOUD, LOCK, BIN, CLOSE } from 'utils/variables';

export const Header = ({ handleClose }) => {
  const { isNewNote } = useSelector(state => state.note);

  const [expanded, setExpanded] = useState(null);

  const handleExpand = () => {
    let element = document.getElementById('editorModalContainer');

    if (expanded) {
      // element.style.width = 'calc(100vw - 297px)';
      element.style.width = 'calc(100vw - 298px)';
    }
    else {
      element.style.width = '100vw';
    }

    setExpanded(!expanded);
  };

  return (
    <div className={css.container}>
      <div className={css.start}>
        <div className={`${css.expand} ${!expanded && css.rotateArrow}`}>
          <IconButton onClick={handleExpand} path={EXPAND} />
        </div>
        <div className={css.arrowBack}>
          <IconButton onClick={handleClose} path={ARROW_BACK} />
        </div>
      </div>
      <div className={css.end}>
        {!isNewNote && <IconButton path={CLOUD} />}
        {!isNewNote && <IconButton path={LOCK} />}
        {!isNewNote && <IconButton path={BIN} />}
        <div className={css.close}>
          <IconButton onClick={handleClose} path={CLOSE} />
        </div>
      </div>
    </div>
  );
};
