import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateColor, deleteArticle, setArticleArchive, addTag, setArticleTags } from 'redux/features/article/articleSlice';
import { SET_MODAL_PREVIEW, SET_MODAL_EDITOR_EMPTY, SET_MODAL_EDITOR_EXISTING } from 'redux/features/modal/modalSlice';
import { doc, deleteDoc, updateDoc, arrayUnion, setDoc } from 'firebase/firestore';
import { db } from 'firebase.js';
import css from './ModalArticleSettings.module.css';

export const ModalArticleSettings = () => {
  const dispatch = useDispatch();
  const { tags } = useSelector(state => state.user);
  const { articleId, isArchived, articleCategories } = useSelector(state => state.article);

  const [open, setOpen] = useState(false);
  const [deletionDialog, setDeletionDialog] = useState(false);
  const [colorsList, setColorsList] = useState(false);
  const [tagsList, setTagsList] = useState(false);

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

    setOpen(false);
  };

  return (
    <>
      <button className={css.mainBtn} onClick={() => setOpen(true)}>settings</button>
      {open && (
        <div className={css.container} onClick={() => setOpen(false)}>
          <div className={css.content} onClick={(e) => e.stopPropagation()}>
            <div className={css.section}>
              <button onClick={() => setOpen(false)}>close</button>
            </div>
            <div className={css.section}>
              <div className={css.buttonWrapper} onClick={() => setTagsList(!tagsList)}>
                <button>tags</button>
                <span className={css.tagsTrigger}></span>
              </div>
              {tagsList && (
                <div className={css.tagsContainer}>
                  {tags?.map(i => <div key={i.id} onClick={() => handleSetCategory(i?.id)}>#{i?.name}</div>)}
                </div>
              )}
            </div>
            <div className={css.section}>
              <div className={css.buttonWrapper} onClick={() => setColorsList(!colorsList)}>
                <button>color</button>
                <span className={css.colorTrigger}></span>
              </div>
              {colorsList && (
                <div className={css.colorsContainer}>
                  <div onClick={() => handleColor("white")} style={{ backgroundColor: "white", color: "black" }}>white</div>
                  <div onClick={() => handleColor("black")} style={{ backgroundColor: "black", color: "white" }}>black</div>
                  <div onClick={() => handleColor("red")} style={{ backgroundColor: "#e03131" }}>red</div>
                  <div onClick={() => handleColor("orange")} style={{ backgroundColor: "#fd7e14" }}>orange</div>
                  <div onClick={() => handleColor("yellow")} style={{ backgroundColor: "#ffd43b" }}>yellow</div>
                  <div onClick={() => handleColor("green")} style={{ backgroundColor: "#2f9e44" }}>green</div>
                  <div onClick={() => handleColor("blue")} style={{ backgroundColor: "#1971c2" }}>blue</div>
                  <div onClick={() => handleColor("purple")} style={{ backgroundColor: "#9c36b5" }}>purple</div>
                </div>
              )}
            </div>
            <div className={css.section}>
              <button onClick={handleArchive}>{isArchived ? 'unarchive' : 'archive'}</button>
            </div>
            <div className={css.section}>
              <button className={css.deleteBtn} onClick={() => setDeletionDialog(!deletionDialog)}>delete</button>
              {deletionDialog && (
                <div>
                  <button onClick={() => setDeletionDialog(false)}>cancel</button>
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
