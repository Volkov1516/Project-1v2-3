import { useState } from 'react';

import css from './ModalEditror.module.css';

export const ModalEditor = ({
  openElement,
  children
}) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div onClick={() => setOpen(true)}>{openElement}</div>
      {open && (
        <div className={css.container}>
          <div className={css.content}>
            <div onClick={() => setOpen(false)}>close</div>
            {children}
          </div>
        </div>
      )}
    </>
  );
};
