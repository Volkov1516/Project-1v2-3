import { useState, useRef } from 'react';

import css from './ModalEditror.module.css';

import Button from 'components/atoms/Button/Button';
import { Title } from './Title/Title';
import { Editor } from 'components/organisms/Editor/Editor';

export const ModalEditor = ({ user }) => {
  const modalEditorContentRef = useRef(null);
  const titleRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [titleState, setTitleState] = useState('');

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
            <Title ref={titleRef} setTitleState={setTitleState} />
            <Editor titleRef={titleRef} titleState={titleState} user={user} modalEditorContentRef={modalEditorContentRef} />
          </div>
        </div>
      )}
    </>
  );
};
