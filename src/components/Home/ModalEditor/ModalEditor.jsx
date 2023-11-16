import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from 'firebase.js';
import { setIsNewArticle, setArticleArchive } from 'redux/features/article/articleSlice';
import { SET_MODAL_EDITOR_EMPTY, SET_MODAL_EDITOR_EXISTING, SET_MODAL_SCROLL, SET_MODAL_PREVIEW } from 'redux/features/modal/modalSlice';
import { Title } from './Title/Title';
import { Editor } from 'components/Home/Editor/Editor';
import css from './ModalEditror.module.css';
import { ModalArticleSettings } from '../ModalArticleSettings/ModalArticleSettings';

export const ModalEditor = () => {
  const dispatch = useDispatch();
  const { tags } = useSelector(state => state.user);
  const { articleTags, articleId, title, isArchived, date } = useSelector(state => state.article);
  const { autofocus, scrollOffset } = useSelector(state => state.modal);

  let newDate = new Date();

  const modalEditorContentRef = useRef(null);
  const titleRef = useRef(null);

  const [saving, setSaving] = useState(false);

  const handleClose = () => {
    const modalEditorElement = document.getElementById('modalEditor');
    dispatch(SET_MODAL_SCROLL(modalEditorElement?.scrollTop));

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
          <button className={css.closeBtn} onClick={handleClose}>close</button>
          {saving && (
            <div className={css.savingContainer}>
              <div className={css.savingSpinner}></div>
            </div>
          )}
        </div>
        <div className={css.right}>
          <ModalArticleSettings />
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
        <div className={css.metadata}>
          <div className={css.date}>
            {date || newDate.toLocaleDateString()}
          </div>
          {tags?.map(i => articleTags?.map(j => {
            return i.id === j.id && <div key={i.id} className={css.category} style={{ color: "#1971c2" }}>#{i?.name}</div>
          }))}
        </div>
      </div>
    </div>
  );
};
