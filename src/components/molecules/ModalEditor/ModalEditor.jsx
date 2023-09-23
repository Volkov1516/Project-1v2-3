import { useState, useRef } from 'react';

import css from './ModalEditror.module.css';

import Button from 'components/atoms/Button/Button';
import { Title } from './Title/Title';
import { Editor } from 'components/organisms/Editor/Editor';

export const ModalEditor = () => {
  const modalEditorContentRef = useRef(null);

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
          <div ref={modalEditorContentRef} className={css.content}>
            <Title />
            <Editor modalEditorContentRef={modalEditorContentRef} />
          </div>
        </div>
      )}
    </>
  );
};
