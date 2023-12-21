import { useState, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addUserCategory, updateUserCategory, deleteUserCategory } from 'redux/features/user/userSlice';
import { setModalCategories } from 'redux/features/modal/modalSlice';
import { db } from 'firebase.js';
import { doc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

import { Input } from './Input';

import css from './CategoriesModal.module.css';

export const CategoriesModal = memo(function CategoriesComponent() {
  const dispatch = useDispatch();
  const { modalCategories } = useSelector(state => state.modal);
  const { userId, userCategories } = useSelector(state => state.user);

  const [inputValue, setInputValue] = useState('');

  const handleOpen = () => {
    dispatch(setModalCategories(true));

    window.history.pushState({ modal: 'categories' }, '', '#categories');
  };

  const handleClose = () => {
    window.history.back();
  }

  const handleAddUserCategory = async () => {
    if (!inputValue) return;

    const newId = uuidv4();

    await setDoc(doc(db, 'users', userId), { categories: arrayUnion({ id: newId, name: inputValue }) }, { merge: true })
      .then(() => dispatch(addUserCategory({ id: newId, name: inputValue })))
      .catch(error => console.log(error));

    setInputValue('');
  };

  const handleUpdateUserCategory = async (id, name) => {
    if (!id || !name) return;

    let categoriesCopy = JSON.parse(JSON.stringify(userCategories));

    categoriesCopy.map((i) => {
      if (i.id === id) {
        return i.name = name;
      }
      else {
        return i;
      }
    });

    await updateDoc(doc(db, 'users', userId), { categories: categoriesCopy })
      .then(() => dispatch(updateUserCategory(categoriesCopy)))
      .catch(error => console.log(error));
  };

  const handleDeleteUserCategory = async (id, name) => {
    if (!id || !name) return;

    await updateDoc(doc(db, 'users', userId), { categories: arrayRemove({ id, name }) })
      .then(() => dispatch(deleteUserCategory(id)))
      .catch(error => console.log(error));
  };

  return (
    <>
      <div className={css.openButton} onClick={handleOpen}>edit categories</div>
      {modalCategories && (
        <div className={css.container} onClick={handleClose}>
          <div className={css.content} onClick={(e) => e.stopPropagation()}>
            <div className={css.header}>
              <span className={css.title}>edit categories</span>
              <button className={css.closeButton} onClick={handleClose}>close</button>
            </div>
            <div className={css.creationGroup}>
              <input className={css.creationInput} placeholder="new category..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
              <button disabled={!inputValue} className={css.creationButton} onClick={handleAddUserCategory}>ok</button>
            </div>
            {userCategories?.map(i => (
              <div key={i.id} className={css.categoryGroup}>
                <Input id={i.id} name={i.name} handleUpdateUserCategory={handleUpdateUserCategory} />
                <div className={css.deleteButton} onClick={() => handleDeleteUserCategory(i.id, i.name)}>delete</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
});
