import { useState, useRef } from 'react';
import { doc, updateDoc } from "firebase/firestore";
import { db } from 'firebase.js';

import css from './ModalEditror.module.css';

import Button from 'components/atoms/Button/Button';
import { Title } from './Title/Title';
import { Editor } from 'components/organisms/Editor/Editor';
import { ModalDelete } from '../ModalDelete/ModalDelete';

export const ModalEditor = ({
  openElement,
  modalEditorStatus,
  setModalEditorStatus,
  user,
  docState,
  titleState,
  setTitleState,
  currentDocId
}) => {
  const modalEditorContentRef = useRef(null);
  const titleRef = useRef(null);

  const [saving, setSaving] = useState(false);

  const handleClose = () => {
    localStorage.removeItem('currentDocId');
    setModalEditorStatus(false);
  };

  const archive = async () => {
    const articleRef = doc(db, "articles", currentDocId);

    await updateDoc(articleRef, {
      archive: true
    });
  };

  return (
    <>
      {openElement}
      {modalEditorStatus && (
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
              <Button variant="text" onClick={archive}>archive</Button>
              <ModalDelete title={titleState || "Untitled"} id={currentDocId} />
              <Button variant="text">collection</Button>
              <Button variant="text">settings</Button>
            </div>
          </div>
          <div ref={modalEditorContentRef} className={css.content}>
            <Title
              ref={titleRef}
              titleState={titleState}
              setTitleState={setTitleState}
            />
            <Editor
              modalEditorContentRef={modalEditorContentRef}
              titleRef={titleRef}
              titleState={titleState}
              user={user}
              docState={docState}
              setSaving={setSaving}
            />
          </div>
        </div>
      )}
    </>
  );
};
