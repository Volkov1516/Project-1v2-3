import { createPortal } from 'react-dom';

import { IconButton } from '../IconButton/IconButton';
import { Tooltip } from 'components/Tooltip/Tooltip';

import css from './Modal.module.css';

import { CLOSE } from 'utils/variables';

export const Modal = ({ open, close, loading, fullWidth, children }) => {
  return open && createPortal(
    <div className={css.container} onClick={close}>
      <div className={`${css.content} ${fullWidth && css.fullWidth}`} onClick={(e) => e.stopPropagation()}>
        <div className={css.header}>
          <Tooltip position="bottom" text="Close">
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
