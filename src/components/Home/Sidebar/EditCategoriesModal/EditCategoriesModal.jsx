import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addCategory, updateCategory, deleteCategory } from 'redux/features/user/userSlice';
import { db } from 'firebase.js';
import { doc, updateDoc, arrayUnion, arrayRemove, setDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

import css from './EditCategoriesModal.module.css';

import { Input } from './Input';

export const EditCategoriesModal = () => {
  const dispatch = useDispatch();
  const { user, categories } = useSelector(state => state.user);

  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleAddCategory = async () => {
    if (!inputValue) return;

    const newId = uuidv4();

    await setDoc(doc(db, 'categories', user?.id), {
      categories: arrayUnion({
        id: newId,
        name: inputValue
      })
    }, { merge: true })
      .then(() => {
        dispatch(addCategory({ id: newId, name: inputValue }));
      })
      .catch((error) => {
        console.log(error);
      });

    setInputValue('');
  };

  const handleUpdateCategory = async (id, name) => {
    if (!name) return;

    let categoriesCopy = JSON.parse(JSON.stringify(categories));

    categoriesCopy.map((i) => {
      if (i.id === id) {
        return i.name = name;
      }
      else {
        return i;
      }
    });

    await setDoc(doc(db, 'categories', user?.id), {
      categories: categoriesCopy
    })
      .then(() => {
        dispatch(updateCategory(categoriesCopy));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDeleteCategory = async (id, name) => {
    const docRef = doc(db, 'categories', user?.id);

    await updateDoc(docRef, {
      categories: arrayRemove({ id, name })
    })
      .then(() => {
        dispatch(deleteCategory(id));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <div className={css.openButton} onClick={() => setOpen(true)}>edit categories</div>
      {open && (
        <div className={css.container} onClick={() => setOpen(false)}>
          <div className={css.content} onClick={(e) => e.stopPropagation()}>
            <div className={css.header}>
              <span className={css.title}>edit categories</span>
              <button className={css.closeButton} onClick={() => setOpen(false)}>close</button>
            </div>
            <div className={css.creationGroup}>
              <input className={css.creationInput} placeholder="new category..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
              <button disabled={!inputValue} className={css.creationButton} onClick={handleAddCategory}>ok</button>
            </div>
            {categories?.map(i => (
              <div key={i.id} className={css.categoryGroup}>
                <Input id={i.id} name={i.name} handleUpdateCategory={handleUpdateCategory} />
                <div className={css.deleteButton} onClick={() => handleDeleteCategory(i.id, i.name)}>delete</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
