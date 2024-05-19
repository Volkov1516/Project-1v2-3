import { createPortal } from 'react-dom';

import { IconButton } from '../IconButton/IconButton';

import css from './Modal.module.css';

import { CLOSE } from 'utils/variables';

export const Modal = ({ open, close, loading, children }) => {
  return open && createPortal(
    <div className={css.container} onClick={close}>
      <div className={css.content} onClick={(e) => e.stopPropagation()}>
        <div className={css.header}>
          <IconButton onClick={close} path={CLOSE} />
        </div>
        {children}
        {loading && <div className={css.loadingContainer}><div className={css.loadingSpinner} /></div>}
      </div>
    </div>,
    document.body
  )
};
