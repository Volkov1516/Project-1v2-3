import { useSelector, useDispatch } from 'react-redux';
import { INCREMENT_CURRENT_INDEX, DECREMENT_CURRENT_INDEX } from 'redux/features/article/articleSlice';
import { SET_MODAL_PREVIEW } from 'redux/features/modal/modalSlice';
import { doc, updateDoc } from "firebase/firestore";
import { db } from 'firebase.js';

import Button from 'components/atoms/Button/Button';
import { Editor } from 'components/organisms/Editor/Editor';
import { ModalDelete } from '../ModalDelete/ModalDelete';

import css from './ModalPreview.module.css';

export const ModalPreview = ({ openElement, openModalEditorFromPreview }) => {
  const dispatch = useDispatch();
  const { filteredArticles, currentId, currentIndex, title } = useSelector(state => state.article);
  const { modalPreview } = useSelector(state => state.modal);

  const prev = () => {
    if (currentIndex === 0) return;

    dispatch(DECREMENT_CURRENT_INDEX());
  };

  const next = () => {
    if (currentIndex === filteredArticles?.length - 1) return;

    dispatch(INCREMENT_CURRENT_INDEX());
  };

  const archive = async () => {
    const articleRef = doc(db, 'articles', currentId);

    await updateDoc(articleRef, {
      archive: !filteredArticles[currentIndex]?.data()?.archive
    });
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
                <Button variant="text" onClick={archive}>{filteredArticles[currentIndex]?.data()?.archive ? 'unarchive' : 'archive'}</Button>
                <ModalDelete title={title || "Untitled"} />
              </div>
              <div className={css.right}>
                <Button variant="text" onClick={close}>close</Button>
              </div>
            </div>
            <div className={css.editor}>
              <div className={css.title}>{title || "Untitled"}</div>
              <Editor preview={true} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
