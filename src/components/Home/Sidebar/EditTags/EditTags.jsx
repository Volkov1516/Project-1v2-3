import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addTag, deleteTag, updateTag } from 'redux/features/user/userSlice';
import { v4 as uuidv4 } from 'uuid';
import { db } from 'firebase.js';
import { doc, updateDoc, arrayUnion, arrayRemove, setDoc } from 'firebase/firestore';
import { TagInput } from './TagInput';
import css from './EditTags.module.css';

export const EditTags = () => {
  const dispatch = useDispatch();
  const { user, tags } = useSelector(state => state.user);

  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const createCategory = async () => {
    if (!inputValue) return;

    const newId = uuidv4();

    await setDoc(doc(db, 'tags', user?.id), {
      tags: arrayUnion({
        id: newId,
        name: inputValue
      })
    }, { merge: true })
      .then(() => {
        dispatch(addTag({ id: newId, name: inputValue }));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteCategory = async (id, name) => {
    const docRef = doc(db, 'tags', user?.id);

    await updateDoc(docRef, {
      tags: arrayRemove({ id, name })
    })
      .then(() => {
        dispatch(deleteTag(id));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleUpdateCategory = async (id, name) => {
    if (!name) return;

    let tagsCopy = JSON.parse(JSON.stringify(tags));

    tagsCopy.map((i) => {
      if (i.id === id) {
        return i.name = name;
      }
      else {
        return i;
      }
    });

    await setDoc(doc(db, 'tags', user?.id), {
      tags: tagsCopy
    })
      .then(() => {
        dispatch(updateTag(tagsCopy));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <button className={css.mainBtn} onClick={() => setOpen(true)}>edit tags</button>
      {open && (
        <div className={css.container} onClick={() => setOpen(false)}>
          <div className={css.content} onClick={(e) => e.stopPropagation()}>
            <div className={css.header}>
              <button className={css.closeBtn} onClick={() => setOpen(false)}>close</button>
            </div>
            <div className={css.inputContainer}>
              <input className={css.input} variant="contained" placeholder="New category" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
              <button className={css.addBtn} onClick={createCategory}>add</button>
            </div>
            {tags?.map(i => (
              <div key={i.id} className={css.categoryGroup}>
                <TagInput id={i.id} name={i.name} handleUpdateCategory={handleUpdateCategory} />
                <button className={css.deleteBtn} onClick={() => deleteCategory(i.id, i.name)}>delete</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
