import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from 'firebase.js';
import { setNewArticle } from 'redux/features/article/articleSlice';
import { SET_MODAL_EDITOR_EMPTY, SET_MODAL_EDITOR_EXISTING, SET_MODAL_SCROLL } from 'redux/features/modal/modalSlice';
import Button from 'components/atoms/Button/Button';
import { Title } from './Title/Title';
import { Editor } from 'components/organisms/Editor/Editor';
import { ModalDelete } from '../ModalDelete/ModalDelete';
import css from './ModalEditror.module.css';

export const ModalEditor = () => {
  const dispatch = useDispatch();
  const { articleId, title } = useSelector(state => state.article);
  const { autofocus, scrollOffset } = useSelector(state => state.modal);

  const modalEditorContentRef = useRef(null);
  const titleRef = useRef(null);

  const [saving, setSaving] = useState(false);

  const handleClose = () => {
    const modalEditorElement = document.getElementById('modalEditor');
    dispatch(SET_MODAL_SCROLL(modalEditorElement.scrollTop));

    dispatch(setNewArticle(false));
    window.history.back();

    dispatch(SET_MODAL_EDITOR_EMPTY(false));
    dispatch(SET_MODAL_EDITOR_EXISTING(false));
  };

  const archive = async () => {
    const articleRef = doc(db, 'articles', articleId);

    await updateDoc(articleRef, {
      archive: true
    });
  };

  useEffect(() => {
    const modalEditorElement = document?.getElementById('modalEditor');
    modalEditorElement?.scrollTo({ top: scrollOffset, behavior: 'smooth' });
  }, [scrollOffset]);

  return (
    <div id="modalEditor" className={css.container}>
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
          saving={saving}
          setSaving={setSaving}
          autofocus={autofocus}
        />
      </div>
    </div>
  );
};
