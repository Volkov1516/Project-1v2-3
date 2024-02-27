import { useState } from 'react';
import { useSelector } from 'react-redux';

import { IconButton } from 'components/atoms/IconButton/IconButton';
import { Settings } from '../Settings/Settings';

import css from './Header.module.css';

export const Header = ({ handleClose }) => {
  const { isNewNote } = useSelector(state => state.note);

  const [expanded, setExpanded] = useState(null);

  const handleExpand = () => {
    let element = document.getElementById('editorModalContainer');

    if (expanded) {
      element.style.width = 'calc(100vw - 297px)';
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
          <IconButton onClick={handleExpand} path="m283.538-220 186.154-260-186.154-260h48.77l186.154 260-186.154 260h-48.77Zm231.846 0 186.154-260-186.154-260h48.77l186.154 260-186.154 260h-48.77Z" />
        </div>
        <div className={css.arrowBack}>
          <IconButton onClick={handleClose} path="m276.846-460 231.693 231.692L480-200 200-480l280-280 28.539 28.308L276.846-500H760v40H276.846Z" />
        </div>
      </div>
      <div className={css.end}>
        {!isNewNote && <Settings />}
        <div className={css.close}>
          <IconButton onClick={handleClose} path="M256-227.692 227.692-256l224-224-224-224L256-732.308l224 224 224-224L732.308-704l-224 224 224 224L704-227.692l-224-224-224 224Z" />
        </div>
      </div>
    </div>
  );
};
