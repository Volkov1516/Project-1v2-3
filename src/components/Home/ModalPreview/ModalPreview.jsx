import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SET_MODAL_EDITOR_EXISTING, SET_MODAL_AUTOFOCUS, SET_MODAL_SCROLL } from 'redux/features/modal/modalSlice';
import { incrementIndex, decrementIndex, setArticleArchive } from 'redux/features/article/articleSlice';
import { SET_MODAL_PREVIEW } from 'redux/features/modal/modalSlice';
import { doc, updateDoc } from "firebase/firestore";
import { db } from 'firebase.js';
import { Editor } from 'components/Home/Editor/Editor';
import { ModalDelete } from 'components/Home/ModalDelete/ModalDelete';
import css from './ModalPreview.module.css';

export const ModalPreview = () => {
  const dispatch = useDispatch();
  const { filteredArticlesId, articleId, articleIndex, title, color, isArchived } = useSelector(state => state.article);
  const { scrollOffset } = useSelector(state => state.modal);

  useEffect(() => {
    const modalPreviewElement = document?.getElementById('modalPreview');
    modalPreviewElement?.scrollTo({ top: scrollOffset, behavior: 'smooth' });
  }, [scrollOffset]);

  const openModalEditorFromPreview = () => {
    window.history.pushState({ modalEditor: 'opened' }, '', '#editor');

    const modalPreviewElement = document.getElementById('modalPreview');
    dispatch(SET_MODAL_SCROLL(modalPreviewElement.scrollTop));
    dispatch(SET_MODAL_AUTOFOCUS(false));
    dispatch(SET_MODAL_EDITOR_EXISTING(true));
  };

  const prev = () => {
    if (articleIndex === 0) return;

    const modalPreviewElement = document.getElementById('modalPreview');
    modalPreviewElement.scrollTo({ top: 0, behavior: 'smooth' });
    dispatch(decrementIndex());
  };

  const next = () => {
    if (articleIndex === filteredArticlesId?.length - 1) return;

    const modalPreviewElement = document.getElementById('modalPreview');
    modalPreviewElement.scrollTo({ top: 0, behavior: 'smooth' });
    dispatch(incrementIndex());
  };

  const handleArchive = async () => {
    const articleRef = doc(db, 'articles', articleId);

    await updateDoc(articleRef, { archive: !isArchived })
      .then(() => {
        dispatch(setArticleArchive({ id: articleId, archive: !isArchived }));
        dispatch(SET_MODAL_PREVIEW(false));
        window.history.back();
      })
      .catch((error) => console.log(error));
  };

  const close = () => {
    window.history.back();
    dispatch(SET_MODAL_PREVIEW(false));
  };

  return (
    <div className={css.container} onClick={close}>
      <div className={css.content} onClick={(e) => e.stopPropagation()}>
        <div className={css.header}>
          <div className={css.left}>
            <div className={css.navigation}>
              <button className={css.navigationBtn} onClick={prev}>prev</button>
              <button className={css.navigationBtn} onClick={next}>next</button>
            </div>
            <button className={css.editBtn} onClick={openModalEditorFromPreview}>edit</button>
            <button className={css.archiveBtn} onClick={handleArchive}>{isArchived ? 'unarchive' : 'archive'}</button>
            <ModalDelete title={title || "Untitled"} />
          </div>
          <div className={css.right}>
            <button className={css.closeBtn} onClick={close}>close</button>
          </div>
        </div>
        <div id="modalPreview" className={css.editor}>
          <div className={`${css.title} ${css[color]}`}>{title || "Untitled"}</div>
          <Editor preview={true} />
        </div>
      </div>
    </div>
  );
};
