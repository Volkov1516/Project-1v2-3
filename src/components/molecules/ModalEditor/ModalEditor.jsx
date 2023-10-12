import { useState, useRef } from 'react';

import css from './ModalEditror.module.css';

import Button from 'components/atoms/Button/Button';
import { Title } from './Title/Title';
import { Editor } from 'components/organisms/Editor/Editor';

import { db } from 'firebase.js';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

export const ModalEditor = ({ user }) => {
  const modalEditorContentRef = useRef(null);
  const titleRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [titleState, setTitleState] = useState('');
  const [editorState, setEditorState] = useState([]);

  const save = async () => {
    if (titleState.length === 0 && editorState.length === 0) {
      return;
    }
    else {
      await addDoc(collection(db, 'articles'), {
        title: titleState,
        content: editorState,
        date: Timestamp.fromDate(new Date()),
        userId: user?.uid
      });
    }
  };

  return (
    <>
      <Button variant="contained" size="large" onClick={() => setOpen(true)}>CREATE</Button>
      {open && (
        <div className={css.container}>
          <div className={css.header}>
            <div className={css.left}>
              <Button variant="text" onClick={() => setOpen(false)}>close</Button>
              <Button variant="text" onClick={save}>save</Button>
            </div>
            <div className={css.right}>
              <Button variant="text">collection</Button>
              <Button variant="text">settings</Button>
            </div>
          </div>
          <div ref={modalEditorContentRef} className={css.content}>
            <Title ref={titleRef} setTitleState={setTitleState} />
            <Editor setEditorState={setEditorState} modalEditorContentRef={modalEditorContentRef} titleRef={titleRef} />
          </div>
        </div>
      )}
    </>
  );
};
