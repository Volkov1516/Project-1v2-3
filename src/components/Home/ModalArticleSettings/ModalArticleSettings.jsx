import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateColor, deleteArticle, setArticleArchive, addTag, setArticleTags } from 'redux/features/article/articleSlice';
import { SET_MODAL_PREVIEW, SET_MODAL_EDITOR_EMPTY, SET_MODAL_EDITOR_EXISTING, setModalSettings } from 'redux/features/modal/modalSlice';
import { doc, deleteDoc, updateDoc, arrayUnion, setDoc } from 'firebase/firestore';
import { db } from 'firebase.js';
import css from './ModalArticleSettings.module.css';

export const ModalArticleSettings = () => {
  const dispatch = useDispatch();
  const { tags } = useSelector(state => state.user);
  const { modalSettings } = useSelector(state => state.modal);
  const { articleId, isArchived, articleCategories } = useSelector(state => state.article);

  const [deletionDialog, setDeletionDialog] = useState(false);

  const handleOpen = () => {
    dispatch(setModalSettings(true));

    window.history.pushState({ modalSettings: 'opened' }, '', '#settings');
  };

  const handleClose = () => {
    dispatch(setModalSettings(false));

    window.history.back();
  };

  const handleSetCategory = async (id) => {
    await setDoc(doc(db, 'articles', articleId),
      {
        categories: arrayUnion({
          id,
        })
      },
      {
        merge: true
      }
    )
      .then(() => {
        dispatch(addTag({ id: articleId, category: id }));
        dispatch(setArticleTags([...articleCategories, id]));
      })
      .catch((error) => console.log(error));
  };

  // const handleRemoveCategory = async (id) => {
  //   const docRef = doc(db, 'articles', articleId);

  //   await updateDoc(docRef, {
  //     categories: arrayRemove({ id })
  //   })
  //     .then(() => {
  //       dispatch(removeCategory({ id: articleId, category: id }));
  //     })
  //     .catch((error) => console.log(error));
  // };

  const handleColor = async (color) => {
    const articleRef = doc(db, 'articles', articleId);

    await updateDoc(articleRef, {
      color: color
    })
      .then(() => {
        dispatch(updateColor({ id: articleId, color: color }));
      })
      .catch((error) => console.log(error));
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

    dispatch(setModalSettings(false));
    window.history.back();
  };

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

    dispatch(setModalSettings(false));
    window.history.back();
  };

  return (
    <>
      <button className={css.mainButton} onClick={handleOpen}>settings</button>
      {modalSettings && (
        <div className={css.container} onClick={handleClose}>
          <div className={css.content} onClick={(e) => e.stopPropagation()}>
            <div className={css.header}>
              <button className={css.closeButton} onClick={handleClose}>close</button>
            </div>
            <div className={css.section}>
              <span className={css.sectionTitle}>tags</span>
              <div className={css.tagsContainer}>
                {tags?.map(i => <button className={css.tagItem} key={i.id} onClick={() => handleSetCategory(i?.id)}>#{i?.name}</button>)}
              </div>
            </div>
            <div className={css.section}>
              <span className={css.sectionTitle}>colors</span>
              <div className={css.colorsContainer}>
                <button className={css.colorItem} onClick={() => handleColor("white")} style={{ backgroundColor: "white", color: "black" }}>white</button>
                <button className={css.colorItem} onClick={() => handleColor("black")} style={{ backgroundColor: "black" }}>black</button>
                <button className={css.colorItem} onClick={() => handleColor("red")} style={{ backgroundColor: "#e03131" }}>red</button>
                <button className={css.colorItem} onClick={() => handleColor("orange")} style={{ backgroundColor: "#fd7e14" }}>orange</button>
                <button className={css.colorItem} onClick={() => handleColor("yellow")} style={{ backgroundColor: "#ffd43b" }}>yellow</button>
                <button className={css.colorItem} onClick={() => handleColor("green")} style={{ backgroundColor: "#2f9e44" }}>green</button>
                <button className={css.colorItem} onClick={() => handleColor("blue")} style={{ backgroundColor: "#1971c2" }}>blue</button>
                <button className={css.colorItem} onClick={() => handleColor("purple")} style={{ backgroundColor: "#9c36b5" }}>purple</button>
              </div>
            </div>
            <div className={css.section}>
              <button onClick={handleArchive}>{isArchived ? 'unarchive' : 'archive'}</button>
            </div>
            <div className={css.section}>
              <button className={css.deleteBtn} onClick={() => setDeletionDialog(!deletionDialog)}>delete</button>
              {deletionDialog && (
                <div className={css.deletionDialog}>
                  <button className={css.cancelDeleteBtn} onClick={() => setDeletionDialog(false)}>cancel</button>
                  <button className={css.deleteBtn} onClick={handleDeleteArticle}>delete forever</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
