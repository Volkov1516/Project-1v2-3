import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setEditFolderModal, setPath } from 'redux/features/app/appSlice';
import { deleteFromDocuments, updateInDocuments } from 'redux/features/user/userSlice';

import { DragAdnDropElement } from 'components/atoms/DragAndDrop/DragAndDropElement';
import { Input } from 'components/atoms/Input/Input';
import { Button } from 'components/atoms/Button/Button';
import { Modal } from 'components/atoms/Modal/Modal';

import { useDragAndDrop } from 'components/atoms/DragAndDrop/DragAndDropContext';

import css from './Folders.module.css';

import folderImg from '../../../../../assets/folder.png';

export const Folders = ({ folders }) => {
  const { preventOnClick } = useDragAndDrop();

  const dispatch = useDispatch();

  const { windowWidth, path, editFolderModal } = useSelector(state => state.app);

  const [folderIdEditFolderModal, setFoldeIdEditFolderModal] = useState(null);
  const [folderInputValue, setFolderInputValue] = useState('');
  const [folderDeleteValue, setFolderDeleteValue] = useState('');
  const [folderDeleteInputValue, setFolderDeleteInputValue] = useState('');

  const handleOpenFolder = (id) => {
    if (preventOnClick) return;

    if (windowWidth < 639) {
      window.location.hash = `folder/${id}`;
    }
    else {
      dispatch(setPath([...path, id]));
    }
  };

  const handleOpenEditFodlerModal = (e, id, name) => {
    e.stopPropagation();

    setFoldeIdEditFolderModal(id);
    setFolderInputValue(name);
    setFolderDeleteValue(name);

    windowWidth < 639 && (window.location.hash = 'editFolder');
    dispatch(setEditFolderModal(true));
  };

  const handleCloseEditFolder = () => windowWidth < 639 ? window.history.back() : dispatch(setEditFolderModal(false));

  const handleEditFolderName = async () => {
    if (folderInputValue === folderDeleteValue) return;

    if (folderInputValue && folderInputValue.length > 0) {
      dispatch(updateInDocuments({ type: 'folders', id: folderIdEditFolderModal, name: 'name', value: folderInputValue }));

      setFolderDeleteValue(folderInputValue);
    }
  }

  const handleDeleteFolder = async () => {
    if (folderDeleteValue !== folderDeleteInputValue) return;

    dispatch(deleteFromDocuments({ type: 'folders', id: folderIdEditFolderModal }));

    setFolderInputValue('');
    setFolderDeleteValue('');
    setFolderDeleteInputValue('');

    handleCloseEditFolder();
  };

  return (
    <div id="folder" className={css.container}>
      {folders?.map((i, index) => (
        <DragAdnDropElement key={index} index={index} id={i.id} type="folder" name={i.name} openSettingsModal={handleOpenEditFodlerModal}>
          <div className={css.folder} onClick={() => handleOpenFolder(i.id)}>
            <img onTouchStart={(e) => e.preventDefault()} draggable={false} src={folderImg} alt="folder" className={css.folderImg} />
            {i.name}
          </div>
        </DragAdnDropElement>
      ))}
      <Modal open={editFolderModal} close={handleCloseEditFolder}>
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
