import { createPortal } from 'react-dom';

import { IconButton, Tooltip } from 'components';

import css from './Modal.module.css';

import { CLOSE } from 'utils/variables';

const Modal = ({ open, close, loading, fullWidth, children }) => {
  return open && createPortal(
    <div className={css.container} onClick={close}>
      <div className={`${css.content} ${fullWidth && css.fullWidth}`} onClick={(e) => e.stopPropagation()}>
        <div className={css.header}>
          <Tooltip preferablePosition="bottom" content="Close">
            <IconButton variant="secondary" path={CLOSE} onClick={close} />
          </Tooltip>
        </div>
        {children}
        {loading && <div className={css.loadingContainer}><div className={css.loadingSpinner} /></div>}
      </div>
    </div>,
    document.body
  )
};

export default Modal;