import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateDocuments, updatePath } from 'redux/features/user/userSlice';
import { db } from 'firebase.js';
import { doc, setDoc } from 'firebase/firestore';

import { IconButton } from 'components/atoms/IconButton/IconButton';
import { Input } from 'components/atoms/Input/Input';
import { Button } from 'components/atoms/Button/Button';
import { Modal } from 'components/atoms/Modal/Modal';

import css from './Folders.module.css';

export const Folders = ({ folders }) => {
  const dispatch = useDispatch();
  const { userId, documents, path } = useSelector(state => state.user);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [folderId, setFoldeId] = useState(null);
  const [folderNameInputValue, setFolderNameNameInput] = useState('');
  const [folderNameInputValueDelete, setFolderNameNameInputDelete] = useState('');

  const handleTouchStart = (e) => {
    const element = e.currentTarget;
    element.classList.add(css.touch);
  };

  const handleTouchEnd = (e) => {
    const element = e.currentTarget;
    element.classList.remove(css.touch);
  }

  const handleOpenFolder = (id) => {
    dispatch(updatePath([...path, id]));
  };

  const handleOpenEditFodlerModal = (e, id, text) => {
    e.stopPropagation();
    setFoldeId(id);
    setFolderNameNameInput(text);
    setOpen(true);
  };

  const handleEditFolderName = async () => {
    setLoading(true);

    const newDocuments = JSON.parse(JSON.stringify(documents));

    function findFolder(object, folderId, newName) {
      if (object.id === folderId) {
        object.text = (newName);
        return true;
      } else if (object.folders && object.folders.length > 0) {
        for (let i = 0; i < object.folders.length; i++) {
          if (findFolder(object.folders[i], folderId, newName)) {
            return true;
          }
        }
      }

      return false;
    }

    findFolder(newDocuments, folderId, folderNameInputValue);

    await setDoc(doc(db, 'users', userId), { documents: newDocuments }, { merge: true })
      .then(() => {
        dispatch(updateDocuments(newDocuments));
        setLoading(false);
      })
      .catch(err => console.log(err));
  }

  const handleDeleteFolder = async () => {
    setLoading(true);

    const newDocuments = JSON.parse(JSON.stringify(documents));

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

    deleteObjectById(folderId, newDocuments.folders);

    await setDoc(doc(db, 'users', userId), { documents: newDocuments }, { merge: true })
      .then(() => {
        dispatch(updateDocuments(newDocuments));
        setLoading(false);
        setOpen(false);
      })
      .catch(err => console.log(err));
  };

  return (
    <div className={css.container}>
      {folders?.map((i, index) => (
        <div
          key={i.id}
          className={css.folder}
          onClick={() => handleOpenFolder(i.id)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className={css.start}>
            <svg className={css.svg} viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
              <path d="M853.333333 256H469.333333l-85.333333-85.333333H170.666667c-46.933333 0-85.333333 38.4-85.333334 85.333333v170.666667h853.333334v-85.333334c0-46.933333-38.4-85.333333-85.333334-85.333333z" fill="#FFA000" /><path d="M853.333333 256H170.666667c-46.933333 0-85.333333 38.4-85.333334 85.333333v426.666667c0 46.933333 38.4 85.333333 85.333334 85.333333h682.666666c46.933333 0 85.333333-38.4 85.333334-85.333333V341.333333c0-46.933333-38.4-85.333333-85.333334-85.333333z" fill="#FFCA28" />
            </svg>
            {i.text}
          </div>
          <span className={css.settings}>
            <IconButton onClick={(e) => handleOpenEditFodlerModal(e, i.id, i.text)} small path="M480-218.461q-16.5 0-28.25-11.75T440-258.461q0-16.501 11.75-28.251t28.25-11.75q16.5 0 28.25 11.75T520-258.461q0 16.5-11.75 28.25T480-218.461ZM480-440q-16.5 0-28.25-11.75T440-480q0-16.5 11.75-28.25T480-520q16.5 0 28.25 11.75T520-480q0 16.5-11.75 28.25T480-440Zm0-221.538q-16.5 0-28.25-11.75T440-701.539q0-16.5 11.75-28.25t28.25-11.75q16.5 0 28.25 11.75t11.75 28.25q0 16.501-11.75 28.251T480-661.538Z" />
          </span>
        </div>
      ))}
      <Modal
        loading={loading}
        open={open}
        setOpen={setOpen}
      >
        <div className={css.eiditFolderModalContent}>
          <Input label="Edit folder name" placeholder="Enter folder name" value={folderNameInputValue} onChange={e => setFolderNameNameInput(e.target.value)} />
          <Button text="Rename folder" disabled={!folderNameInputValue} onClick={handleEditFolderName} />
          <Input label={`Enter ${folderNameInputValue} to delete the folder`} placeholder="Enter folder name" value={folderNameInputValueDelete} onChange={e => setFolderNameNameInputDelete(e.target.value)} />
          <Button text="Delete folder" disabled={!folderNameInputValueDelete} onClick={handleDeleteFolder} />
        </div>
      </Modal>
    </div>
  );
};