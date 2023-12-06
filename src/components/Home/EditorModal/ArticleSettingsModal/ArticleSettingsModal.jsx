import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateColor, deleteArticle, setArticleArchive, addTag, setArticleTags } from 'redux/features/article/articleSlice';
import { setModalSettings } from 'redux/features/modal/modalSlice';
import { doc, deleteDoc, updateDoc, arrayUnion, setDoc } from 'firebase/firestore';
import { db } from 'firebase.js';

import css from './ArticleSettingsModal.module.css';

export const ArticleSettingsModal = ({ openButtonColor }) => {
  const dispatch = useDispatch();
  const { categories } = useSelector(state => state.user);
  const { modalSettings } = useSelector(state => state.modal);
  const { articleId, isArchived, articleCategories, title, color } = useSelector(state => state.article);

  const [deletionDialog, setDeletionDialog] = useState(false);
  const [deletionInputValue, setDeltionInputValue] = useState('');

  const handleOpen = () => {
    dispatch(setModalSettings(true));

    window.history.pushState({}, '', '#settings');
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
      })
      .catch((error) => console.log(error));

    dispatch(setModalSettings(false));
    window.history.back();
  };

  return (
    <>
      <div className={`${css.openButton} ${css[openButtonColor]}`} onClick={handleOpen}>settings</div>
      {modalSettings && (
        <div className={css.container} onClick={handleClose}>
          <div className={css.content} onClick={(e) => e.stopPropagation()}>
            <div className={css.header}>
              <span className={css.title}>article settings</span>
              <div className={css.closeButton} onClick={handleClose}>close</div>
            </div>

            <div className={css.colorsContainer}>
              <div className={`${css.color} ${color === "white" && css.active}`} onClick={() => handleColor("white")} style={{ backgroundColor: "white" }}></div>
              <div className={`${css.color} ${color === "black" && css.active}`} onClick={() => handleColor("black")} style={{ backgroundColor: "black" }}></div>
              <div className={`${css.color} ${color === "red" && css.active}`} onClick={() => handleColor("red")} style={{ backgroundColor: "#e03131" }}></div>
              <div className={`${css.color} ${color === "orange" && css.active}`} onClick={() => handleColor("orange")} style={{ backgroundColor: "#fd7e14" }}></div>
              <div className={`${css.color} ${color === "yellow" && css.active}`} onClick={() => handleColor("yellow")} style={{ backgroundColor: "#ffd43b" }}></div>
              <div className={`${css.color} ${color === "green" && css.active}`} onClick={() => handleColor("green")} style={{ backgroundColor: "#2f9e44" }}></div>
              <div className={`${css.color} ${color === "blue" && css.active}`} onClick={() => handleColor("blue")} style={{ backgroundColor: "#1971c2" }}></div>
              <div className={`${css.color} ${color === "purple" && css.active}`} onClick={() => handleColor("purple")} style={{ backgroundColor: "#9c36b5" }}></div>
            </div>

            <div className={css.categoriesContainer}>
              {categories?.map(i => (
                <div key={i.id} className={css.category} onClick={() => handleSetCategory(i?.id)}>
                  {i?.name}
                </div>
              ))}
            </div>

            <div className={css.archiveButton} onClick={handleArchive}>{isArchived ? 'unarchive' : 'archive'}</div>




            <div className={css.deleteButton} onClick={() => setDeletionDialog(!deletionDialog)}>delete</div>
            {deletionDialog && (
              <div className={css.deletionContainer} onClick={() => setDeletionDialog(false)}>
                <div className={css.deletionContent} onClick={(e) => e.stopPropagation()}>
                  <div className={css.deletionHeader}>
                    <div className={css.deletionCloseButton} onClick={() => setDeletionDialog(false)}>close</div>
                  </div>
                  <span className={css.message}>type <b className={css.deletionTitle}>{title}</b> to proceed deletion</span>
                  <input className={css.input} type="text" placeholder="type here..." value={deletionInputValue} onChange={(e) => setDeltionInputValue(e.target.value)} />
                  <button disabled={deletionInputValue !== title} className={css.deleteForeverButton} onClick={handleDeleteArticle}>delete forever</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
