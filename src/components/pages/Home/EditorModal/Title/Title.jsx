import { useEffect, forwardRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateDocuments } from 'redux/features/user/userSlice';
import { setIsNewDocument, createDocument, updateDocument } from 'redux/features/document/documentSlice';
import { db } from 'firebase.js';
import { doc, setDoc, updateDoc, Timestamp } from 'firebase/firestore';

import css from './Title.module.css';

export const Title = forwardRef(function MyTitle(props, ref) {
  const dispatch = useDispatch();
  const { userId, documents, path } = useSelector(state => state.user);
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
    const newNote = {
      id: documentId,
      title: title,
    };

    const newDocuments = JSON.parse(JSON.stringify(documents));

    function findFolder(object, id, newObject) {
      if (object.id === id) {
        object.notes.push(newObject);
        return true;
      } else if (object.folders && object.folders.length > 0) {
        for (let i = 0; i < object.folders.length; i++) {
          if (findFolder(object.folders[i], id, newObject)) {
            return true;
          }
        }
      }
      return false;
    }

    findFolder(newDocuments, path[path.length - 1], newNote);

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

      await setDoc(doc(db, 'users', userId), { documents: newDocuments }, { merge: true })
        .then(() => {
          dispatch(updateDocuments(newDocuments));
        })
        .catch(err => console.log(err));
    }
    else {
      await updateDoc(doc(db, 'documents', documentId), { title })
        .then(() => dispatch(updateDocument({ id: documentId, key: 'title', value: title })))
        .catch(error => console.log(error));

      await setDoc(doc(db, 'users', userId), { documents: newDocuments }, { merge: true })
        .then(() => {
          dispatch(updateDocuments(newDocuments));
        })
        .catch(err => console.log(err));
    }
  }

  const handleEnter = (e) => e.key === 'Enter' && e.preventDefault();

  return (
    <div className={css.container}>
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
    </div>
  );
});
