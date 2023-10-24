import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ADD_CATEGORY, DELETE_CATEGORY, UPDATE_CATEGORY } from 'redux/features/user/userSlice';
import { v4 as uuidv4 } from 'uuid';

import { db } from 'firebase.js';
import { doc, updateDoc, arrayUnion, arrayRemove, setDoc } from 'firebase/firestore';

import Button from 'components/atoms/Button/Button';

import css from './ModalCategory.module.css';
import { Input } from 'components/atoms/Input/Input';
import { CategoryInput } from './CategoryInput';

export const ModalCategory = () => {
  const dispatch = useDispatch();
  const { user, categories } = useSelector(state => state.user);

  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const createCategory = async () => {
    if (!inputValue) return;

    const newId = uuidv4();

    await setDoc(doc(db, 'categories', user?.id), {
      categories: arrayUnion({
        id: newId,
        name: inputValue
      })
    }, { merge: true })
      .then(() => {
        dispatch(ADD_CATEGORY({ id: newId, name: inputValue }));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteCategory = async (id, name) => {
    const docRef = doc(db, 'categories', user?.id);

    await updateDoc(docRef, {
      categories: arrayRemove({ id, name })
    })
      .then(() => {
        dispatch(DELETE_CATEGORY(id));
      })
      .catch((error) => {
        console.log(error);
      });
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
        dispatch(UPDATE_CATEGORY(categoriesCopy));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <div className={css.dropdownItem} onClick={() => setOpen(true)}>edit categories</div>
      {open && (
        <div className={css.container} onClick={() => setOpen(false)}>
          <div className={css.content} onClick={(e) => e.stopPropagation()}>
            <div className={css.header}>
              <Button variant="text" onClick={() => setOpen(false)}>close</Button>
            </div>
            <div className={css.inputContainer}>
              <Input variant="contained" placeholder="New category" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
              <Button variant="contained" onClick={createCategory}>add</Button>
            </div>
            {categories?.map(i => (
              <div key={i.id} className={css.categoryGroup}>
                <CategoryInput id={i.id} name={i.name} handleUpdateCategory={handleUpdateCategory} />
                <Button variant="text" color="red" onClick={() => deleteCategory(i.id, i.name)}>delete</Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};