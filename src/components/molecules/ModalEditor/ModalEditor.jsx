import { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { doc, updateDoc } from 'firebase/firestore';
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
  autofocus
}) => {
  const { currentId, title } = useSelector(state => state.article);

  const modalEditorContentRef = useRef(null);
  const titleRef = useRef(null);

  const [saving, setSaving] = useState(false);

  const handleClose = () => {
    window.history.back();
    setModalEditorStatus();
  };

  const archive = async () => {
    const articleRef = doc(db, 'articles', currentId);

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
                </div>
              )}
            </div>
            <div className={css.right}>
              <Button variant="text" onClick={archive}>archive</Button>
              <ModalDelete title={title || "Untitled"} />
            </div>
          </div>
          <div ref={modalEditorContentRef} className={css.content}>
            <Title ref={titleRef} />
            <Editor
              modalEditorContentRef={modalEditorContentRef}
              titleRef={titleRef}
              setSaving={setSaving}
              autofocus={autofocus}
            />
          </div>
        </div>
      )}
    </>
  );
};
