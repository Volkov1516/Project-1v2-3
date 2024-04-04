import { useState } from 'react';
import { useSelector } from 'react-redux';

import { IconButton } from 'components/atoms/IconButton/IconButton';

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
        {!isNewNote && <IconButton path="M414-307.692 612.308-506l-28.77-28.769L413.769-365l-85.538-85.539L299.692-422 414-307.692ZM260-200q-74.846 0-127.423-52.231Q80-304.461 80-379.308q0-68.769 47-122.077 47-53.307 116.846-57.231Q257.308-646 324.231-703 391.154-760 480-760q100.077 0 170.039 69.961Q720-620.077 720-520v40h24.615q57.462 1.846 96.424 42.192Q880-397.462 880-340q0 58.846-40.577 99.423Q798.846-200 740-200H260Zm0-40h480q42 0 71-29t29-71q0-42-29-71t-71-29h-60v-80q0-83-58.5-141.5T480-720q-83 0-141.5 58.5T280-520h-20q-58 0-99 41t-41 99q0 58 41 99t99 41Zm220-240Z" />}
        {!isNewNote && <IconButton path="M200-120v-480h120v-80q0-66.846 46.577-113.423T480-840q66.846 0 113.423 46.577T640-680v80h120v480H200Zm40-40h480v-400H240v400Zm240-140q25.308 0 42.654-17.346Q540-334.692 540-360q0-25.308-17.346-42.654Q505.308-420 480-420q-25.308 0-42.654 17.346Q420-385.308 420-360q0 25.308 17.346 42.654Q454.692-300 480-300ZM360-600h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM240-160v-400 400Z" />}
        {!isNewNote && <IconButton path="M240-160v-560h-40v-40h160v-30.77h240V-760h160v40h-40v560H240Zm40-40h400v-520H280v520Zm112.307-80h40.001v-360h-40.001v360Zm135.385 0h40.001v-360h-40.001v360ZM280-720v520-520Z" />}
        <div className={css.close}>
          <IconButton onClick={handleClose} path="M256-227.692 227.692-256l224-224-224-224L256-732.308l224 224 224-224L732.308-704l-224 224 224 224L704-227.692l-224-224-224 224Z" />
        </div>
      </div>
    </div>
  );
};
