import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSnackbar } from 'redux/features/app/appSlice';
import { updateDocuments, updatePath } from 'redux/features/user/userSlice';
import { db } from 'firebase.js';
import { doc, setDoc } from 'firebase/firestore';

import { IconButton } from 'components/atoms/IconButton/IconButton';
import { Input } from 'components/atoms/Input/Input';
import { Button } from 'components/atoms/Button/Button';
import { Modal } from 'components/atoms/Modal/Modal';

import css from './Folders.module.css';

import { findFolder } from 'utils/findFolder';

export const Folders = ({ folders }) => {
  let timeout;

  const dispatch = useDispatch();

  const { userId, documents, path } = useSelector(state => state.user);

  const [openEditFolderModal, setOpenEditFolderModal] = useState(false);
  const [loadingEditFolderModal, setLoadingEditFolderModal] = useState(false);
  const [folderIdEditFolderModal, setFoldeIdEditFolderModal] = useState(null);
  const [folderInputValue, setFolderInputValue] = useState('');
  const [folderDeleteValue, setFolderDeleteValue] = useState('');
  const [folderDeleteInputValue, setFolderDeleteInputValue] = useState('');

  const handleOpenFolder = (id) => dispatch(updatePath([...path, id]));

  const handleOpenEditFodlerModal = (e, id, name) => {
    e.stopPropagation();
    setFoldeIdEditFolderModal(id);
    setFolderInputValue(name);
    setFolderDeleteValue(name);
    setOpenEditFolderModal(true);
  };

  const handleEditFolderName = async () => {
    if (folderInputValue === folderDeleteValue) return;

    if (folderInputValue && folderInputValue.length > 0) {
      setLoadingEditFolderModal(true);

      const newDocuments = JSON.parse(JSON.stringify(documents));

      const editFolderName = (targetFolder) => targetFolder.name = folderInputValue;

      findFolder(newDocuments, folderIdEditFolderModal, editFolderName);

      try {
        await setDoc(doc(db, 'users', userId), { documents: newDocuments }, { merge: true });

        dispatch(updateDocuments(newDocuments));
        dispatch(setSnackbar('Folder was renamed'));
      } catch (error) {
        dispatch(setSnackbar('Failed to rename the folder'));
      }

      setFolderDeleteValue(folderInputValue);
      setLoadingEditFolderModal(false);
    }
  }

  const handleDeleteFolder = async () => {
    if (folderDeleteValue !== folderDeleteInputValue) return;

    setLoadingEditFolderModal(true);

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

    deleteObjectById(folderIdEditFolderModal, newDocuments.folders);

    try {
      await setDoc(doc(db, 'users', userId), { documents: newDocuments }, { merge: true });

      dispatch(updateDocuments(newDocuments));
      dispatch(setSnackbar('Folder was deleted'));
    } catch (error) {
      dispatch(setSnackbar('Failed to delete the folder'));
    }

    setFolderInputValue('');
    setFolderDeleteValue('');
    setFolderDeleteInputValue('');
    setLoadingEditFolderModal(false);
    setOpenEditFolderModal(false);
  };

  const handleTouchStart = (e, id, name) => {
    const element = e.currentTarget;
    element.classList.add(css.touch);

    timeout = setTimeout(() => handleOpenEditFodlerModal(e, id, name), 1000);
  };

  const handleTouchEnd = (e) => {
    const element = e.currentTarget;
    element.classList.remove(css.touch);

    clearTimeout(timeout);
  };

  const handleTouchMove = () => {
    clearTimeout(timeout);
  };

  return (
    <div id="folders" className={css.container}>
      {folders?.map((i, index) => (
        <div
          key={i.id}
          id={i.id}
          className={css.folder}
          onClick={() => handleOpenFolder(i.id)}
          onTouchStart={e => handleTouchStart(e, i.id, i.name)}
          onTouchEnd={e => handleTouchEnd(e)}
          onTouchMove={e => handleTouchMove(e)}
        >
          <div className={css.start}>
            <svg className={css.svg} viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
              <path d="M853.333333 256H469.333333l-85.333333-85.333333H170.666667c-46.933333 0-85.333333 38.4-85.333334 85.333333v170.666667h853.333334v-85.333334c0-46.933333-38.4-85.333333-85.333334-85.333333z" fill="#FFA000" /><path d="M853.333333 256H170.666667c-46.933333 0-85.333333 38.4-85.333334 85.333333v426.666667c0 46.933333 38.4 85.333333 85.333334 85.333333h682.666666c46.933333 0 85.333333-38.4 85.333334-85.333333V341.333333c0-46.933333-38.4-85.333333-85.333334-85.333333z" fill="#FFCA28" />
            </svg>
            {i.name}
          </div>
          <span className={css.settings}>
            <IconButton onClick={(e) => handleOpenEditFodlerModal(e, i.id, i.name)} small path="M480-218.461q-16.5 0-28.25-11.75T440-258.461q0-16.501 11.75-28.251t28.25-11.75q16.5 0 28.25 11.75T520-258.461q0 16.5-11.75 28.25T480-218.461ZM480-440q-16.5 0-28.25-11.75T440-480q0-16.5 11.75-28.25T480-520q16.5 0 28.25 11.75T520-480q0 16.5-11.75 28.25T480-440Zm0-221.538q-16.5 0-28.25-11.75T440-701.539q0-16.5 11.75-28.25t28.25-11.75q16.5 0 28.25 11.75t11.75 28.25q0 16.501-11.75 28.251T480-661.538Z" />
          </span>
        </div>
      ))}
      <Modal
        loading={loadingEditFolderModal}
        open={openEditFolderModal}
        setOpen={setOpenEditFolderModal}
      >
        <div className={css.eiditFolderModalContent}>
          <Input id="folderNameId" label="Edit folder name" placeholder="Enter folder name" value={folderInputValue} onChange={e => setFolderInputValue(e.target.value)} />
          <Button type="outlined" disabled={!folderInputValue} onClick={handleEditFolderName}>Rename folder</Button>
          <Input id="folderDleteId" label={`Enter ${folderDeleteValue} to delete the folder`} placeholder="Enter folder name" value={folderDeleteInputValue} onChange={e => setFolderDeleteInputValue(e.target.value)} />
          <Button type="outlined" disabled={folderDeleteValue !== folderDeleteInputValue} onClick={handleDeleteFolder}>Delete folder</Button>
        </div>
      </Modal>
    </div>
  );
};
