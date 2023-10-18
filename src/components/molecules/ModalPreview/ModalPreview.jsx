import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { INCREMENT_CURRENT_INDEX, DECREMENT_CURRENT_INDEX } from 'redux/features/article/articleSlice';
import { doc, updateDoc } from "firebase/firestore";
import { db } from 'firebase.js';

import Button from 'components/atoms/Button/Button';
import { Editor } from 'components/organisms/Editor/Editor';
import { ModalDelete } from '../ModalDelete/ModalDelete';

import css from './ModalPreview.module.css';

export const ModalPreview = ({
  openElement,
  modalPreviewStatus,
  setModalPreviewStatus,
  openModalEditorFromPreview,
}) => {
  const dispatch = useDispatch();
  const { filteredArticles, currentId, currentIndex, title } = useSelector(state => state.article);

  const prev = () => {
    if (currentIndex === 0) return;

    dispatch(DECREMENT_CURRENT_INDEX());
  };

  const next = () => {
    if (currentIndex === filteredArticles?.length - 1) return;

    dispatch(INCREMENT_CURRENT_INDEX())
  };

  const archive = async () => {
    const articleRef = doc(db, 'articles', currentId);

    await updateDoc(articleRef, {
      archive: !filteredArticles[currentIndex]?.data()?.archive
    });
  };

  return (
    <>
      {openElement}
      {modalPreviewStatus && (
        <div className={css.container} onClick={() => setModalPreviewStatus(false)}>
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
                <Button variant="text" onClick={() => setModalPreviewStatus(false)}>close</Button>
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
