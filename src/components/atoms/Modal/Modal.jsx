import { createPortal } from 'react-dom';

import { IconButton } from '../IconButton/IconButton';

import css from './Modal.module.css';

export const Modal = ({ loading, open, setOpen, children }) => {

  return (
    <>
      {open && createPortal(
        <div className={css.container} onClick={() => setOpen(false)}>
          <div className={css.content} onClick={(e) => e.stopPropagation()}>
            <div className={css.header}>
              <IconButton onClick={() => setOpen(false)} path="M256-227.692 227.692-256l224-224-224-224L256-732.308l224 224 224-224L732.308-704l-224 224 224 224L704-227.692l-224-224-224 224Z" />
            </div>
            {children}
            {loading && <div className={css.loadingContainer}><div className={css.loadingSpinner} /></div>}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
