import { useState } from 'react';

import css from './ModalEditror.module.css';

import Button from 'components/atoms/Button/Button';

export const ModalEditor = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="contained" size="large" onClick={() => setOpen(true)}>CREATE</Button>
      {open && (
        <div className={css.container}>
          <div className={css.header}>
            <div className={css.left}>
              <Button variant="text" onClick={() => setOpen(false)}>close</Button>
            </div>
            <div className={css.right}>
              <Button variant="text">collection</Button>
              <Button variant="text">settings</Button>
            </div>
          </div>
          <div className={css.content}>
            <div style={{widht: "100px", height: "500px", backgroundColor: "gray"}}></div>
            <div style={{widht: "100px", height: "500px", backgroundColor: "black"}}></div>
            <div style={{widht: "100px", height: "500px", backgroundColor: "gray"}}></div>
          </div>
        </div>
      )}
    </>
  );
};
