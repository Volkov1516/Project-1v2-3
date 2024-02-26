import { useState, useEffect, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateDocument, deleteDocument } from 'redux/features/document/documentSlice';
import { setEditorModalStatus, setDocumentSettingsModal, setDocumentDeleteModal } from 'redux/features/modal/modalSlice';
import { doc, deleteDoc, updateDoc, arrayUnion, arrayRemove, setDoc } from 'firebase/firestore';
import { db } from 'firebase.js';

import { IconButton } from 'components/atoms/IconButton/IconButton';

import css from './Settings.module.css';

export const Settings = memo(function SettingsComponent() {
  const dispatch = useDispatch();
  const { userCategories } = useSelector(state => state.user);
  const { documentSettingsModal, documentDeleteModal } = useSelector(state => state.modal);
  const { documentId, archive, title, color, documentCategories } = useSelector(state => state.document);

  const [deletionInputValue, setDeltionInputValue] = useState('');
  const [checkboxState, setCheckboxState] = useState(null);

  useEffect(() => {
    const initialState = {};
    userCategories?.forEach(i => initialState[i.id] = documentCategories?.some(j => j?.id === i?.id));
    setCheckboxState(initialState);
  }, [documentId, documentCategories, userCategories]);

  const handleOpen = () => {
    dispatch(setDocumentSettingsModal(true));
  };

  const handleClose = () => {
  };

  const handleCloseDeletion = () => {
  };

  const handleOpenDeletion = () => {
    dispatch(setDocumentDeleteModal(true));
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
      })
      .catch(error => console.log(error));
  };

  const handleDeleteArticle = async () => {
    await deleteDoc(doc(db, 'documents', documentId))
      .then(() => {
        dispatch(deleteDocument({ id: documentId }));
        dispatch(setDocumentDeleteModal(false));
        dispatch(setDocumentSettingsModal(false));
        dispatch(setEditorModalStatus(false));
      })
      .catch(error => console.log(error));
  };

  return (
    <>
      <IconButton onClick={handleOpen} path="m405.384-120-14.461-115.692q-19.154-5.769-41.423-18.154-22.269-12.385-37.885-26.538L204.923-235l-74.616-130 92.231-69.539q-1.769-10.846-2.923-22.346-1.154-11.5-1.154-22.346 0-10.077 1.154-21.192t2.923-25.038L130.307-595l74.616-128.462 105.923 44.616q17.923-14.923 38.769-26.923 20.846-12 40.539-18.539L405.384-840h149.232l14.461 116.461q23 8.077 40.654 18.539 17.654 10.461 36.346 26.154l109-44.616L829.693-595l-95.308 71.846q3.308 12.385 3.692 22.731.385 10.346.385 20.423 0 9.308-.769 19.654-.77 10.346-3.539 25.038L827.923-365l-74.615 130-107.231-46.154q-18.692 15.693-37.615 26.923-18.923 11.231-39.385 17.77L554.616-120H405.384ZM440-160h78.231L533-268.308q30.231-8 54.423-21.961 24.192-13.962 49.269-38.269L736.462-286l39.769-68-87.539-65.769q5-17.077 6.616-31.423 1.615-14.346 1.615-28.808 0-15.231-1.615-28.808-1.616-13.577-6.616-29.884L777.769-606 738-674l-102.077 42.769q-18.154-19.923-47.731-37.346t-55.961-23.115L520-800h-79.769l-12.462 107.538q-30.231 6.462-55.577 20.808-25.346 14.346-50.423 39.423L222-674l-39.769 68L269-541.231q-5 13.462-7 29.231-2 15.769-2 32.769Q260-464 262-449q2 15 6.231 29.231l-86 65.769L222-286l99-42q23.538 23.769 48.885 38.115 25.346 14.347 57.115 22.347L440-160Zm38.923-220q41.846 0 70.923-29.077 29.077-29.077 29.077-70.923 0-41.846-29.077-70.923Q520.769-580 478.923-580q-42.077 0-71.039 29.077-28.961 29.077-28.961 70.923 0 41.846 28.961 70.923Q436.846-380 478.923-380ZM480-480Z" />
      {documentSettingsModal && (
        <div className={css.container} onClick={handleClose}>
          <div className={css.content} onClick={(e) => e.stopPropagation()}>
            <div className={css.header}>
              <span className={css.title}>document settings</span>
              <IconButton onClick={handleClose} path="M256-227.692 227.692-256l224-224-224-224L256-732.308l224 224 224-224L732.308-704l-224 224 224 224L704-227.692l-224-224-224 224Z" />
            </div>
            <div className={css.colorsContainer}>
              <div className={`${css.color} ${color === "white" && css.active}`} onClick={() => handleColor("none")} style={{ backgroundColor: "white" }}></div>
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
            {documentDeleteModal && (
              <div className={css.deletionContainer} onClick={handleCloseDeletion}>
                <div className={css.deletionContent} onClick={(e) => e.stopPropagation()}>
                  <div className={css.deletionHeader}>
                    <IconButton onClick={handleCloseDeletion} path="M256-227.692 227.692-256l224-224-224-224L256-732.308l224 224 224-224L732.308-704l-224 224 224 224L704-227.692l-224-224-224 224Z" />
                  </div>
                  <span className={css.message}>type <b className={css.deletionTitle}>{title}</b> to proceed deletion</span>
                  <input className={css.input} type="text" placeholder="type here..." value={deletionInputValue} onChange={(e) => setDeltionInputValue(e.target.value)} />
                  {title
                    ? <button disabled={deletionInputValue?.toLowerCase().trim() !== title?.toLowerCase().trim()} className={css.deleteForeverButton} onClick={handleDeleteArticle}>delete forever</button>
                    : <button className={css.deleteForeverButton} onClick={handleDeleteArticle}>delete forever</button>
                  }
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
});
