import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateColor, deleteArticle, setArticleArchive, addArticleCategories, removeCategory } from 'redux/features/article/articleSlice';
import { setModalSettings, setModalDeleteArticle } from 'redux/features/modal/modalSlice';
import { doc, deleteDoc, updateDoc, arrayUnion, arrayRemove, setDoc } from 'firebase/firestore';
import { db } from 'firebase.js';

import css from './ArticleSettingsModal.module.css';

export default function ArticleSettingsModal() {
  const dispatch = useDispatch();
  const { categories } = useSelector(state => state.user);
  const { modalSettings, modalDeleteArticle } = useSelector(state => state.modal);
  const { articleId, isArchived, title, color, articleCategories } = useSelector(state => state.article);

  const [deletionInputValue, setDeltionInputValue] = useState('');
  const [checkboxState, setCheckboxState] = useState(null);

  useEffect(() => {
    const initialState = {};
    categories?.forEach(i => initialState[i.id] = articleCategories?.some(j => j?.id === i?.id));
    setCheckboxState(initialState);
  }, [articleId, articleCategories, categories]);

  const handleOpen = () => {
    dispatch(setModalSettings(true));

    window.history.pushState({modal: 'articleSettings'}, '', '#settings');
  };

  const handleClose = () => {
    window.history.back();
  };

  const handleOpenDeletion = () => {
    dispatch(setModalDeleteArticle(true));

    window.history.pushState({modal: 'deleteArticle'}, '', '#delete');
  };

  const handleCloseDeletion = () => {
    window.history.back();
  };

  const handleCategory = async (e, id, name) => {
    if (e.target.checked) {
      await setDoc(doc(db, 'articles', articleId), { categories: arrayUnion({ id, name }) }, { merge: true })
        .then(() => {
          setCheckboxState(prevState => ({ ...prevState, [id]: !prevState[id] }));
          dispatch(addArticleCategories({ id: articleId, categoryId: id, categoryName: name }));
        })
        .catch((error) => console.log(error));
    }
    else {
      const docRef = doc(db, 'articles', articleId);

      await updateDoc(docRef, { categories: arrayRemove({ id, name }) })
        .then(() => {
          setCheckboxState(prevState => ({ ...prevState, [id]: !prevState[id] }));
          dispatch(removeCategory({ id: articleId, categoryId: id }));
        })
        .catch((error) => console.log(error));
    }
  };

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
      <div className={css.openButton} onClick={handleOpen}>settings</div>
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
                <label key={i.id} className={css.categoryText}>
                  {i?.name}
                  <input className={css.categoryCheckbox} type="checkbox" checked={checkboxState[i.id]} onChange={(e) => handleCategory(e, i?.id, i?.name)} />
                </label>
              ))}
            </div>
            <div className={css.archiveButton} onClick={handleArchive}>{isArchived ? 'unarchive' : 'archive'}</div>
            <div className={css.deleteButton} onClick={handleOpenDeletion}>delete</div>
            {modalDeleteArticle && (
              <div className={css.deletionContainer} onClick={handleCloseDeletion}>
                <div className={css.deletionContent} onClick={(e) => e.stopPropagation()}>
                  <div className={css.deletionHeader}>
                    <div className={css.deletionCloseButton} onClick={handleCloseDeletion}>close</div>
                  </div>
                  <span className={css.message}>type <b className={css.deletionTitle}>{title}</b> to proceed deletion</span>
                  <input className={css.input} type="text" placeholder="type here..." value={deletionInputValue} onChange={(e) => setDeltionInputValue(e.target.value)} />
                  <button disabled={deletionInputValue.toLowerCase().trim() !== title.toLowerCase().trim()} className={css.deleteForeverButton} onClick={handleDeleteArticle}>delete forever</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
