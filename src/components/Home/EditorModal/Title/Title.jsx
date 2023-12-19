import { useEffect, forwardRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setIsNewDocument, addArticle, setArticleTitle, updateArticle } from 'redux/features/article/articleSlice';
import { db } from 'firebase.js';
import { doc, setDoc, updateDoc, Timestamp } from 'firebase/firestore';

import css from './Title.module.css';

export const Title = forwardRef(function MyTitle(props, ref) {
  const dispatch = useDispatch();
  const { userId } = useSelector(state => state.user);
  const { isNewDocument, documentId, title, color } = useSelector(state => state.article);
  const { editorModalStatus } = useSelector(state => state.modal);

  const { saving } = props;

  useEffect(() => {
    if (ref?.current) {
      ref.current.style.height = '40px';
      ref.current.style.height = (ref?.current.scrollHeight) + 'px';
    }
  }, [title, ref]);

  const onTitleChange = async (e) => {
    dispatch(setArticleTitle(e.target.value));
  };

  const onTitleBlur = async () => {
    if(isNewDocument && !saving) {
      await setDoc(doc(db, 'articles', documentId), {
        title: title,
        date: Timestamp.fromDate(new Date()),
        userId: userId
      })
        .then(() => {
          dispatch(setIsNewDocument(false));
          dispatch(addArticle({
            id: documentId,
            title: title,
            date: Timestamp.fromDate(new Date()).toDate().toLocaleDateString(),
            userId: userId
          }));
        })
        .catch(error => console.log(error));
    }
    else {
      await updateDoc(doc(db, 'articles', documentId), { title: title })
        .then(() =>  dispatch(updateArticle({ id: documentId, title: title })))
        .catch(error => console.log(error));
    }
  }

  const handleEnter = (e) => e.key === 'Enter' && e.preventDefault();

  return (
    <textarea
      ref={ref}
      className={`${css[color]} ${css[editorModalStatus]}`}
      rows={1}
      spellCheck={false}
      placeholder="Title"
      value={editorModalStatus === "preview" ? (title || 'UNTITLED') : title}
      onChange={onTitleChange}
      onBlur={onTitleBlur}
      onKeyDown={handleEnter}
      readOnly={editorModalStatus === "preview"}
    />
  );
});
