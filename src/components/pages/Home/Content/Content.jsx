import { memo, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentDocument } from 'redux/features/document/documentSlice';
import { setEditorModalStatus } from 'redux/features/modal/modalSlice';
import { updateDocuments } from 'redux/features/user/userSlice';
import { db } from 'firebase.js';
import { doc, setDoc } from 'firebase/firestore';

import { FolderNavigation } from './FolderNavigation/FolderNavigation';
import { Folders } from './Folders/Folders';

import css from './Content.module.css';

export const Content = memo(function MemoizedContent({ mouseTimer }) {
  const dispatch = useDispatch();
  const { userId, documents, path } = useSelector(state => state.user);
  const { filteredDocumentsId } = useSelector(state => state.document);

  const [folder, setFolder] = useState(null);

  useEffect(() => {
    function findFolder(object, id) {
      if (object.id === id) {
        return object;
      } else if (object.folders && object.folders.length > 0) {
        for (let i = 0; i < object.folders.length; i++) {
          const result = findFolder(object.folders[i], id);

          if (result) {
            return result;
          }
        }
      }

      return null;
    }

    let res = findFolder(documents, path[path.length - 1]);
    setFolder(res);
  }, [documents, path]);

  const handleEditFolder = async (id, text = 'Renamed') => {
    const newDocuments = JSON.parse(JSON.stringify(documents));

    function findFolder(object, id, newName) {
      if (object.id === id) {
        object.text = (newName);
        return true;
      } else if (object.folders && object.folders.length > 0) {
        for (let i = 0; i < object.folders.length; i++) {
          if (findFolder(object.folders[i], id, newName)) {
            return true;
          }
        }
      }

      return false;
    }

    findFolder(newDocuments, id, text);

    await setDoc(doc(db, 'users', userId), { documents: newDocuments }, { merge: true })
      .then(() => dispatch(updateDocuments(newDocuments)))
      .catch(err => console.log(err));
  };

  const handleDeleteFolder = async () => {
    const newDocuments = JSON.parse(JSON.stringify(documents));
    console.log(newDocuments);

    function deleteObjectById(id, folders) {
      for (let i = 0; i < folders.length; i++) {
        if (folders[i].id === id) {
          folders.splice(i, 1);
          return;
        }
        if (folders[i].folders && folders[i].folders.length > 0) {
          deleteObjectById(id, folders[i].folders);
        }
      }
    }

    deleteObjectById("fd032abf-d611-4963-95a9-3e4a7318690d", newDocuments.folders);
    console.log(newDocuments);

    await setDoc(doc(db, 'users', userId), { documents: newDocuments }, { merge: true })
      .then(() => dispatch(updateDocuments(newDocuments)))
      .catch(err => console.log(err));
  };

  const openModalEditor = (id, title, content, color, categories, archive) => {
    let documentIndex;

    for (const [index, value] of filteredDocumentsId?.entries()) {
      if (id === value) {
        documentIndex = index;
      }
    }

    dispatch(setCurrentDocument({
      isNew: false,
      index: documentIndex,
      id,
      title,
      content,
      color,
      categories,
      archive
    }));
    dispatch(setEditorModalStatus('editorModalFromComponent'));

    window.history.pushState({ modal: 'editorModalFromComponent' }, '', '#editor');
  };

  const onMouseDown = (id, title, content, color, categories, archive) => {
    onMouseUp();

    mouseTimer = window.setTimeout(() => {
      window.navigator.vibrate(100);

      let documentIndex;

      for (const [index, value] of filteredDocumentsId?.entries()) {
        if (id === value) {
          documentIndex = index;
        }
      }

      dispatch(setCurrentDocument({
        isNew: false,
        index: documentIndex,
        id,
        title,
        content,
        color,
        categories,
        archive
      }));
      dispatch(setEditorModalStatus('preview'));

      window.history.pushState({ modal: 'preview' }, '', '#preview');
    }, 500);
  };

  const onMouseUp = () => mouseTimer && window.clearTimeout(mouseTimer);

  return (
    <div className={css.container} onScroll={onMouseUp}>
      <FolderNavigation text={folder?.text} />
      <Folders folders={folder?.folders} />
    </div>
  );
});
