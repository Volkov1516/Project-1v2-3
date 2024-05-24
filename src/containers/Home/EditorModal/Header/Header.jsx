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
          <IconButton variant="secondary" path={EXPAND} onClick={handleExpand} />
        </div>
        <div className={css.arrowBack}>
          <IconButton variant="secondary" path={ARROW_BACK} onClick={handleClose} />
        </div>
      </div>
      <div className={css.end}>
        {!isNewNote && <IconButton variant="secondary" path={CLOUD} />}
        {!isNewNote && <IconButton variant="secondary" path={LOCK} />}
        {!isNewNote && <IconButton variant="secondary" path={BIN} />}
        <div className={css.close}>
          <IconButton variant="secondary" path={CLOSE} onClick={handleClose} />
        </div>
      </div>
    </div>
  );
};
