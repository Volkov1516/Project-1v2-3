import { useState } from 'react';
import { useSelector } from 'react-redux';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from 'firebase.js';

import css from './ModalDelete.module.css';

import Button from 'components/atoms/Button/Button';

export const ModalDelete = ({ title }) => {
  const { articleId } = useSelector(state => state.article);

  const [open, setOpen] = useState(false);

  const deleteArticle = async () => {
    await deleteDoc(doc(db, 'articles', articleId));
    setOpen(false);
  };

  return (
    <>
      <Button variant="text" onClick={() => setOpen(true)}>delete</Button>
      {open && (
        <div className={css.container} onClick={() => setOpen(false)}>
          <div className={css.content} onClick={(e) => e.stopPropagation()}>
            <div className={css.text}>
              Are you sure you want to delete <b>{title}</b> forever?
            </div>
            <div className={css.navigation}>
              <Button variant="text" onClick={() => setOpen(false)}>cancel</Button>
              <Button variant="text" color="red" onClick={deleteArticle}>delete forever</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
