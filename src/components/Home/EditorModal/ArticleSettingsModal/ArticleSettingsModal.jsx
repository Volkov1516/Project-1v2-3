import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateDocument, deleteDocument } from 'redux/features/document/documentSlice';
import { setModalSettings, setModalDeleteArticle } from 'redux/features/modal/modalSlice';
import { doc, deleteDoc, updateDoc, arrayUnion, arrayRemove, setDoc } from 'firebase/firestore';
import { db } from 'firebase.js';

import css from './ArticleSettingsModal.module.css';

export default function ArticleSettingsModal() {
  const dispatch = useDispatch();
  const { userCategories } = useSelector(state => state.user);
  const { modalSettings, modalDeleteArticle } = useSelector(state => state.modal);
  const { documentId, archive, title, color, documentCategories } = useSelector(state => state.document);

  const [deletionInputValue, setDeltionInputValue] = useState('');
  const [checkboxState, setCheckboxState] = useState(null);

  useEffect(() => {
    const initialState = {};
    userCategories?.forEach(i => initialState[i.id] = documentCategories?.some(j => j?.id === i?.id));
    setCheckboxState(initialState);
  }, [documentId, documentCategories, userCategories]);

  const handleOpen = () => {
    dispatch(setModalSettings(true));

    window.history.pushState({ modal: 'articleSettings' }, '', '#settings');
  };

  const handleClose = () => {
    window.history.back();
  };

  const handleOpenDeletion = () => {
    dispatch(setModalDeleteArticle(true));

    window.history.pushState({ modal: 'deleteArticle' }, '', '#delete');
  };

  const handleCloseDeletion = () => {
    window.history.back();
  };

  const handleCategory = async (e, id, name) => {
    if (e.target.checked) {
      await setDoc(doc(db, 'documents', documentId), { categories: arrayUnion({ id, name }) }, { merge: true })
        .then(() => {
          let newDocumentCategories;

          if (documentCategories) {
            newDocumentCategories = [...documentCategories, { id, name }];
          } else {
            newDocumentCategories = [{ id, name }];
          }

          dispatch(updateDocument({ id: documentId, key: 'categories', value: newDocumentCategories }));
          setCheckboxState(prevState => ({ ...prevState, [id]: !prevState[id] }));
        })
        .catch(error => console.log(error));
    }
    else {
      await updateDoc(doc(db, 'documents', documentId), { categories: arrayRemove({ id, name }) })
        .then(() => {
          let newDocumentCategories = documentCategories?.filter(i => i.id !== id);

          dispatch(updateDocument({ id: documentId, key: 'categories', value: newDocumentCategories }));
          setCheckboxState(prevState => ({ ...prevState, [id]: !prevState[id] }));
        })
        .catch(error => console.log(error));
    }
  };

  const handleColor = async (color) => {
    await updateDoc(doc(db, 'documents', documentId), { color })
      .then(() => dispatch(updateDocument({ id: documentId, key: 'color', value: color })))
      .catch(error => console.log(error));
  };

  const handleArchive = async () => {
    await updateDoc(doc(db, 'documents', documentId), { archive: !archive })
      .then(() => {
        dispatch(updateDocument({ id: documentId, key: 'archive', value: !archive }));
        window.history.back();
      })
      .catch(error => console.log(error));

    window.history.back();
  };

  const handleDeleteArticle = async () => {
    await deleteDoc(doc(db, 'documents', documentId))
      .then(() => {
        dispatch(deleteDocument({ id: documentId }));
        window.history.back();
      })
      .catch(error => console.log(error));

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
              {userCategories?.map(i => (
                <label key={i.id} className={css.categoryText}>
                  {i?.name}
                  <input className={css.categoryCheckbox} type="checkbox" checked={checkboxState[i.id]} onChange={(e) => handleCategory(e, i?.id, i?.name)} />
                </label>
              ))}
            </div>
            <div className={css.archiveButton} onClick={handleArchive}>{archive ? 'unarchive' : 'archive'}</div>
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
