import { useEffect, forwardRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setIsNewDocument, createDocument, updateDocument } from 'redux/features/document/documentSlice';
import { db } from 'firebase.js';
import { doc, setDoc, updateDoc, Timestamp } from 'firebase/firestore';

import css from './Title.module.css';

export const Title = forwardRef(function MyTitle(props, ref) {
  const dispatch = useDispatch();
  const { userId } = useSelector(state => state.user);
  const { isNewDocument, documentId, title, color } = useSelector(state => state.document);
  const { editorModalStatus } = useSelector(state => state.modal);

  const { saving } = props;

  useEffect(() => {
    if (ref?.current) {
      ref.current.style.height = '40px';
      ref.current.style.height = (ref?.current.scrollHeight) + 'px';
    }
  }, [title, ref]);

  const onTitleChange = async (e) => dispatch(updateDocument({ id: documentId, key: 'title', value: e.target.value }));

  const onTitleBlur = async () => {
    if (isNewDocument && !saving) {
      await setDoc(doc(db, 'documents', documentId), { userId, date: Timestamp.fromDate(new Date()), title })
        .then(() => {
          dispatch(setIsNewDocument(false));
          dispatch(createDocument({
            id: documentId,
            title,
            date: Timestamp.fromDate(new Date()).toDate().toLocaleDateString(),
            userId
          }));
        })
        .catch(error => console.log(error));
    }
    else {
      await updateDoc(doc(db, 'documents', documentId), { title })
        .then(() => dispatch(updateDocument({ id: documentId, key: 'title', value: title })))
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
