import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from 'firebase.js';
import { setIsNewArticle, setArticleArchive } from 'redux/features/article/articleSlice';
import { SET_MODAL_EDITOR_EMPTY, SET_MODAL_EDITOR_EXISTING, SET_MODAL_SCROLL, SET_MODAL_PREVIEW } from 'redux/features/modal/modalSlice';
import Button from 'components/Button/Button';
import { Title } from './Title/Title';
import { Editor } from 'components/Editor/Editor';
import { ModalDelete } from '../ModalDelete/ModalDelete';
import css from './ModalEditror.module.css';

export const ModalEditor = () => {
  const dispatch = useDispatch();
  const { articleId, title, isArchived } = useSelector(state => state.article);
  const { autofocus, scrollOffset } = useSelector(state => state.modal);

  const modalEditorContentRef = useRef(null);
  const titleRef = useRef(null);

  const [saving, setSaving] = useState(false);

  const handleClose = () => {
    const modalEditorElement = document.getElementById('modalEditor');
    dispatch(SET_MODAL_SCROLL(modalEditorElement.scrollTop));

    dispatch(setIsNewArticle(false));
    window.history.back();

    dispatch(SET_MODAL_EDITOR_EMPTY(false));
    dispatch(SET_MODAL_EDITOR_EXISTING(false));
  };

  const handleArchive = async () => {
    const articleRef = doc(db, 'articles', articleId);

    await updateDoc(articleRef, { archive: !isArchived })
      .then(() => {
        dispatch(setArticleArchive({ id: articleId, archive: !isArchived }));
        dispatch(SET_MODAL_EDITOR_EMPTY(false));
        dispatch(SET_MODAL_EDITOR_EXISTING(false));
        window.history.back();
        dispatch(SET_MODAL_PREVIEW(false));
        window.history.back();
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    const modalEditorElement = document?.getElementById('modalEditor');
    modalEditorElement?.scrollTo({ top: scrollOffset, behavior: 'smooth' });
  }, [scrollOffset]);

  return (
    <div id="modalEditor" className={css.container}>
      <div className={css.header}>
        <div className={css.left}>
          <Button variant="text" color="blue" onClick={handleClose}>close</Button>
          {saving && (
            <div className={css.savingContainer}>
              <div className={css.savingSpinner}></div>
            </div>
          )}
        </div>
        <div className={css.right}>
          <Button variant="text" color="blue" onClick={handleArchive}>{isArchived ? 'unarchive' : 'archive'}</Button>
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
