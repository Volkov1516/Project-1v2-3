import { useState } from 'react';
import { useSelector } from 'react-redux';

import { IconButton } from 'components/IconButton/IconButton';
import { Tooltip } from 'components/Tooltip/Tooltip';

import css from './Header.module.css';

import { EXPAND, ARROW_BACK, CLOUD, LOCK, CLOSE } from 'utils/variables';

export const Header = ({ handleClose }) => {
  const { isNewNote } = useSelector(state => state.note);

  const [expanded, setExpanded] = useState(null);

  const handleExpand = () => {
    let element = document.getElementById('editorModalContainer');

    if (expanded) {
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
        {!isNewNote && <Tooltip preferablePosition="bottom" content="Lock"><IconButton variant="secondary" path={LOCK} /></Tooltip>}
        <div className={css.close}>
          <Tooltip preferablePosition="bottom" content="Close">
            <IconButton variant="secondary" path={CLOSE} onClick={handleClose} />
          </Tooltip>
        </div>
      </div>
    </div>
  );
};
