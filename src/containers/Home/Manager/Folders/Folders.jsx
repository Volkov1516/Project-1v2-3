import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setEditFolderModal, setPath } from 'redux/features/app/appSlice';
import { deleteFromDocuments, updateInDocuments } from 'redux/features/user/userSlice';

import { Button } from 'components/Button/Button';
import { Input } from 'components/Input/Input';
import { Modal } from 'components/Modal/Modal';
import { DragAdnDropElement } from 'components/DragAndDrop/DragAndDropElement';

import { useDragAndDrop } from 'components/DragAndDrop/DragAndDropContext';

import css from './Folders.module.css';

import folderImg from 'assets/images/folder.png';

export const Folders = ({ folders }) => {
  const { preventOnClick } = useDragAndDrop();

  const dispatch = useDispatch();

  const { windowWidth, path, editFolderModal } = useSelector(state => state.app);

  const [folderIdEditFolderModal, setFoldeIdEditFolderModal] = useState(null);
  const [initialFolderInputValue, setInitialFolderInputValue] = useState('');
  const [folderInputValue, setFolderInputValue] = useState('');
  const [folderDeleteValue, setFolderDeleteValue] = useState('');
  const [folderDeleteInputValue, setFolderDeleteInputValue] = useState('');

  const handleTouchStart = e => e.currentTarget.classList.add(css.touch);

  const handleTouchEnd = e => e.currentTarget.classList.remove(css.touch);

  const handleOpenFolder = (id) => {
    if (preventOnClick) return;

    if (windowWidth <= 480) {
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
    setInitialFolderInputValue(name);
    setFolderDeleteValue(name);

    windowWidth <= 480 && (window.location.hash = 'editFolder');
    dispatch(setEditFolderModal(true));
  };

  const handleCloseEditFolder = () => {
    windowWidth <= 480 ? window.history.back() : dispatch(setEditFolderModal(false));
    setFolderInputValue('');
    setFolderDeleteValue(null);
    setFolderDeleteInputValue('');
  };

  const handleEditFolderName = async () => {
    if (folderInputValue === initialFolderInputValue) return;

    if (folderInputValue && folderInputValue.length > 0) {
      dispatch(updateInDocuments({ type: 'folders', id: folderIdEditFolderModal, name: 'name', value: folderInputValue }));

      setInitialFolderInputValue(folderInputValue);
      setFolderDeleteValue(folderInputValue);
    }
  };

  const handleDeleteFolder = async () => {
    if (folderDeleteValue !== folderDeleteInputValue) return;

    dispatch(deleteFromDocuments({ type: 'folders', id: folderIdEditFolderModal }));

    setFolderInputValue('');
    setFolderDeleteValue('');
    setFolderDeleteInputValue('');

    handleCloseEditFolder();
  };

  return (
    <div id="folder" className={`${css.container} ${folders?.length > 0 && css.containerOffset}`}>
      {folders?.map((i, index) => (
        <DragAdnDropElement key={index} index={index} id={i.id} type="folder" name={i.name} openSettingsModal={handleOpenEditFodlerModal}>
          <div className={css.folder} onClick={() => handleOpenFolder(i.id)} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
            <img className={css.folderImg} src={folderImg} alt="folder" draggable={false} onContextMenu={e => e.preventDefault()} />
            <span className={css.folderName}>{i.name}</span>
          </div>
        </DragAdnDropElement>
      ))}
      <Modal open={editFolderModal} close={handleCloseEditFolder}>
        <div className={css.eiditFolderModalContent}>
          <Input id="folderNameId" label="Edit folder name" placeholder="Enter folder name" value={folderInputValue} onChange={e => setFolderInputValue(e.target.value)} onEnter={handleEditFolderName} />
          <Button variant="outlined" disabled={!folderInputValue || folderInputValue === initialFolderInputValue} onClick={handleEditFolderName}>Rename folder</Button>
          <Input id="folderDleteId" label={`Enter ${folderDeleteValue} to delete the folder`} placeholder="Enter folder name" value={folderDeleteInputValue} onChange={e => setFolderDeleteInputValue(e.target.value)} />
          <Button variant="outlined" disabled={folderDeleteValue !== folderDeleteInputValue} onClick={handleDeleteFolder}>Delete folder</Button>
        </div>
      </Modal>
    </div>
  );
};
