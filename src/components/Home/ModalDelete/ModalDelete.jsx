import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteArticle } from 'redux/features/article/articleSlice';
import { SET_MODAL_PREVIEW, SET_MODAL_EDITOR_EMPTY, SET_MODAL_EDITOR_EXISTING } from 'redux/features/modal/modalSlice';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from 'firebase.js';
import css from './ModalDelete.module.css';

export const ModalDelete = ({ title }) => {
  const dispatch = useDispatch();
  const { articleId } = useSelector(state => state.article);

  const [open, setOpen] = useState(false);

  const handleDeleteArticle = async () => {
    await deleteDoc(doc(db, 'articles', articleId))
      .then(() => {
        dispatch(deleteArticle({ id: articleId }));
        window.history.back();
        dispatch(SET_MODAL_PREVIEW(false));
        dispatch(SET_MODAL_EDITOR_EMPTY(false));
        dispatch(SET_MODAL_EDITOR_EXISTING(false));
      })
      .catch((error) => console.log(error));

    setOpen(false);
  };

  return (
    <>
      <button className={css.mainBtn} onClick={() => setOpen(true)}>delete</button>
      {open && (
        <div className={css.container} onClick={() => setOpen(false)}>
          <div className={css.content} onClick={(e) => e.stopPropagation()}>
            <div className={css.text}>
              Are you sure you want to delete <b>{title}</b> forever?
            </div>
            <div className={css.navigation}>
              <button className={css.cancelBtn} onClick={() => setOpen(false)}>cancel</button>
              <button className={css.deleteBtn} onClick={handleDeleteArticle}>delete forever</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
