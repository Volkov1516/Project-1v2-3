import { useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

import css from './ModalEditror.module.css';

import Button from 'components/atoms/Button/Button';
import { Title } from './Title/Title';
import { Editor } from 'components/organisms/Editor/Editor';

export const ModalEditor = ({ user }) => {
  const modalEditorContentRef = useRef(null);
  const titleRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [titleState, setTitleState] = useState('');
  const [saving, setSaving] = useState(false);

  const handleOpen = () => {
    const newId = uuidv4();
    localStorage.setItem('currentDocId', newId);
    setOpen(true);
  };

  const handleClose = () => {
    localStorage.removeItem('currentDocId');
    setOpen(false);
  };

  return (
    <>
      <Button variant="contained" size="large" onClick={handleOpen}>CREATE</Button>
      {open && (
        <div className={css.container}>
          <div className={css.header}>
            <div className={css.left}>
              <Button variant="text" onClick={handleClose}>close</Button>
              {saving && (
                <div className={css.savingContainer}>
                <div className={css.savingSpinner}></div>
                <span className={css.savingText}>saving...</span>
              </div>
              )}
            </div>
            <div className={css.right}>
              <Button variant="text">collection</Button>
              <Button variant="text">settings</Button>
            </div>
          </div>
          <div ref={modalEditorContentRef} className={css.content}>
            <Title ref={titleRef} setTitleState={setTitleState} />
            <Editor setSaving={setSaving} titleRef={titleRef} titleState={titleState} user={user} modalEditorContentRef={modalEditorContentRef} />
          </div>
        </div>
      )}
    </>
  );
};
