import { useState } from 'react';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import { db } from 'firebase.js';
import { doc, updateDoc, arrayUnion, arrayRemove, setDoc } from 'firebase/firestore';

import Button from 'components/atoms/Button/Button';

import css from './ModalCategory.module.css';
import { Input } from 'components/atoms/Input/Input';

export const ModalCategory = () => {
  const { user, categories } = useSelector(state => state.user);

  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const createCategory = async () => {
    const newId = uuidv4();

    await setDoc(doc(db, 'categories', user?.id),
      {
        categories: arrayUnion({
          id: newId,
          name: inputValue
        })
      },
      {
        merge: true
      }
    );
  };

  const deleteCategory = async (id, name) => {
    const docRef = doc(db, 'categories', user?.id);

    await updateDoc(docRef, {
      categories: arrayRemove({ id, name })
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
              <div key={i?.id} className={css.dropdownItem} style={{ color: "#1971c2" }} onClick={() => deleteCategory(i.id, i.name)}>#{i?.name}</div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
