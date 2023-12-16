import { useEffect, forwardRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setIsNewArticle, addArticle, setArticleTitle, updateArticle } from 'redux/features/article/articleSlice';
import { db } from 'firebase.js';
import { doc, setDoc, updateDoc, Timestamp } from 'firebase/firestore';

import css from './Title.module.css';

export const Title = forwardRef(function MyTitle(props, ref) {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.user);
  const { articleId, title, color, isNewArticle } = useSelector(state => state.article);
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
    if(isNewArticle && !saving) {
      await setDoc(doc(db, 'articles', articleId), {
        title: title,
        // content: state,
        date: Timestamp.fromDate(new Date()),
        userId: user?.id
      })
        .then(() => {
          dispatch(setIsNewArticle(false));
          dispatch(addArticle({
            id: articleId,
            title: title,
            // content: state,
            date: Timestamp.fromDate(new Date()).toDate().toLocaleDateString(),
            userId: user?.id
          }));
        })
        .catch((error) => console.log(error));
    }
    else {
      await updateDoc(doc(db, 'articles', articleId), {
        title: title,
        // content: state,
      })
        .then(() => {
          dispatch(updateArticle({
            id: articleId,
            title: title,
            // content: state
          }));
        })
        .catch((error) => console.log(error));
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
