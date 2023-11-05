import { useSelector, useDispatch } from 'react-redux';
import { SET_CURRENT_ID, SET_TITLE, SET_CONTENT } from 'redux/features/article/articleSlice';
import { SET_MODAL_EDITOR_EXISTING, SET_MODAL_AUTOFOCUS } from 'redux/features/modal/modalSlice';
import { INCREMENT_CURRENT_INDEX, DECREMENT_CURRENT_INDEX, SET_ARCHIVE } from 'redux/features/article/articleSlice';
import { SET_MODAL_PREVIEW } from 'redux/features/modal/modalSlice';
import { doc, updateDoc } from "firebase/firestore";
import { db } from 'firebase.js';

import Button from 'components/atoms/Button/Button';
import { Editor } from 'components/organisms/Editor/Editor';
import { ModalDelete } from '../ModalDelete/ModalDelete';

import css from './ModalPreview.module.css';

export const ModalPreview = ({ openElement }) => {
  const dispatch = useDispatch();
  const { filteredArticles, articleId, articleIndex, title } = useSelector(state => state.article);
  const { modalPreview } = useSelector(state => state.modal);

  const openModalEditorFromPreview = () => {
    window.history.pushState({modalEditor: 'opened'}, '', '#editor');

    dispatch(SET_TITLE(filteredArticles[articleIndex]?.title));
    dispatch(SET_CURRENT_ID(filteredArticles[articleIndex]?.id));
    dispatch(SET_CONTENT(filteredArticles[articleIndex]?.content));
    dispatch(SET_MODAL_AUTOFOCUS(false));
    dispatch(SET_MODAL_EDITOR_EXISTING(true));
  };

  const prev = () => {
    if (articleIndex === 0) return;

    dispatch(DECREMENT_CURRENT_INDEX());
  };

  const next = () => {
    if (articleIndex === filteredArticles?.length - 1) return;

    dispatch(INCREMENT_CURRENT_INDEX());
  };

  const archive = async () => {
    const articleRef = doc(db, 'articles', articleId);

    await updateDoc(articleRef, {
      archive: !filteredArticles[articleIndex]?.archive
    })
      .then(() => {
        dispatch(SET_ARCHIVE({ id: articleId, archive: !filteredArticles[articleIndex]?.archive }));
      })
      .catch((error) => console.log(error));
  };

  const close = () => {
    window.history.back();
    dispatch(SET_MODAL_PREVIEW(false));
  };

  return (
    <>
      {openElement}
      {modalPreview && (
        <div className={css.container} onClick={close}>
          <div className={css.content} onClick={(e) => e.stopPropagation()}>
            <div className={css.header}>
              <div className={css.left}>
                <div className={css.navigation}>
                  <Button variant="contained" onClick={prev}>prev</Button>
                  <Button variant="contained" onClick={next}>next</Button>
                </div>
                <Button variant="text" onClick={openModalEditorFromPreview}>edit</Button>
                <Button variant="text" onClick={archive}>{filteredArticles[articleIndex]?.archive ? 'unarchive' : 'archive'}</Button>
                <ModalDelete title={title || "Untitled"} />
              </div>
              <div className={css.right}>
                <Button variant="text" onClick={close}>close</Button>
              </div>
            </div>
            <div className={css.editor}>
              <div className={`${css.title} ${css[filteredArticles[articleIndex]?.color]}`}>{title || "Untitled"}</div>
              <Editor preview={true} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
