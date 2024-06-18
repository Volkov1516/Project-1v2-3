import { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPath, setModalFolderSettings } from 'redux/features/app/appSlice';
import { dndSwap, dndInside, dndOutside, updateInDocuments, deleteFromDocuments } from 'redux/features/user/userSlice';
import Sortable from 'sortablejs';

import { Button } from 'components/Button/Button';
import { Input } from 'components/Input/Input';
import { Modal } from 'components/Modal/Modal';

import css from './Folders.module.css';

import folderImg from 'assets/images/folder.png';

export const Folders = ({ folders }) => {
  const dispatch = useDispatch();

  const { windowWidth, path, modalFolderSettings } = useSelector(state => state.app);

  const containerRef = useRef(null);
  const holdTimeout = useRef(null);
  const swapTimeout = useRef(null);

  const [folderId, setFoldeId] = useState(null);
  const [initialFolderNameInputValue, setInitialFolderNameInputValue] = useState('');
  const [folderNameInputValue, setFolderNameInputValue] = useState('');
  const [folderNameDeleteInputValue, setFolderNameDeleteInputValue] = useState('');

  useEffect(() => {
    let overFolder;
    let canSwapWithFolder = false;

    if (containerRef.current) {
      const sortable = new Sortable(containerRef.current, {
        animation: 200,
        delay: 300,
        delayOnTouchOnly: true,
        disabled: modalFolderSettings,
        scroll: true,
        scrollSensitivity: 100,
        onChoose: (e) => {
          if (e.originalEvent instanceof TouchEvent && e.originalEvent.changedTouches.length > 0) {
            holdTimeout.current = setTimeout(() => {
              const id = e.item.getAttribute('data-id');
              const name = e.item.getAttribute('data-name');

              setFoldeId(id);
              setInitialFolderNameInputValue(name);
              setFolderNameInputValue(name);
              window.location.hash = 'editFolder';
              dispatch(setModalFolderSettings(true));
            }, 300);
          }
        },
        onStart: () => {
          clearTimeout(holdTimeout.current);
        },
        onMove: (e) => {
          if (e.related !== overFolder) {
            clearTimeout(swapTimeout.current);
            canSwapWithFolder = false;
            overFolder = e.related;
            swapTimeout.current = setTimeout(() => {
              canSwapWithFolder = true;
            }, 1000);
          } else if (canSwapWithFolder) {
            overFolder = null;
          }

          if (e.related === overFolder && !canSwapWithFolder) {
            return false;
          }
        },
        onEnd: (e) => {
          clearTimeout(holdTimeout.current);
          clearTimeout(swapTimeout.current);

          let x, y;

          if (e.originalEvent instanceof MouseEvent) {
            x = e.originalEvent.clientX;
            y = e.originalEvent.clientY;
          }
          else if (e.originalEvent instanceof TouchEvent && e.originalEvent.changedTouches.length > 0) {
            x = e.originalEvent.changedTouches[0].clientX;
            y = e.originalEvent.changedTouches[0].clientY;
          }

          const elementFromPoint = document.elementFromPoint(x, y);
          const containerRect = containerRef.current.getBoundingClientRect();
          const isOutside = x < containerRect.left || x > containerRect.right || y < containerRect.top || y > containerRect.bottom;
          const targetElementId = elementFromPoint.getAttribute('data-id');

          if (isOutside && targetElementId !== 'folder-navigation') {
            return;
          }
          else if (isOutside && targetElementId === 'folder-navigation') {
            dispatch(dndOutside({ type: 'folders', items: folders, oldIndex: e.oldIndex }));
          }
          else if (overFolder) {
            dispatch(dndInside({ type: 'folders', items: folders, oldIndex: e.oldIndex, newFolderId: targetElementId }));
          }
          else {
            dispatch(dndSwap({ type: 'folders', items: folders, oldIndex: e.oldIndex, newIndex: e.newIndex }));
          }

          overFolder = null;
          canSwapWithFolder = false;
        }
      });

      return () => sortable && sortable.destroy();
    }
  }, [dispatch, folders, modalFolderSettings]);

  const handleOpenFolder = (id) => {
    if (windowWidth <= 480) {
      window.location.hash = `folder/${id}`;
    }
    else {
      dispatch(setPath([...path, id]));
    }
  };

  const handleCloseSettings = () => {
    setFoldeId(null);
    setInitialFolderNameInputValue('');
    setFolderNameInputValue('');
    setFolderNameDeleteInputValue('');

    windowWidth <= 480 ? window.history.back() : dispatch(setModalFolderSettings(false));
  };

  const handleEditFolderName = () => {
    if (folderNameInputValue === initialFolderNameInputValue) return;

    if (folderNameInputValue && folderNameInputValue.length > 0) {
      dispatch(updateInDocuments({ type: 'folders', id: folderId, name: 'name', value: folderNameInputValue }));

      setInitialFolderNameInputValue(folderNameInputValue);
    }
  };

  const handleDeleteFolder = () => {
    if (folderNameDeleteInputValue !== initialFolderNameInputValue) return;

    dispatch(deleteFromDocuments({ type: 'folders', id: folderId }));

    handleCloseSettings();
  };

  return (
    <div ref={containerRef} className={css.container}>
      {folders?.map(i => (
        <div key={i.id} data-id={i.id} data-type="folder" data-name={i.name} className={css.folder} onClick={() => handleOpenFolder(i.id)}>
          <img data-id={i.id} data-type="folder" className={css.img} src={folderImg} alt="folder" />
          <span data-id={i.id} data-type="folder" className={css.name}>{i.name}</span>
        </div>
      ))}
      <Modal open={modalFolderSettings} close={handleCloseSettings}>
        <div className={css.modal}>
          <Input name="nameInput" label="Edit folder name" placeholder="Enter folder name" value={folderNameInputValue} onChange={e => setFolderNameInputValue(e.target.value)} />
          <Button variant="outlined" disabled={!folderNameInputValue || folderNameInputValue === initialFolderNameInputValue} onClick={handleEditFolderName}>Rename folder</Button>
          <Input name="deleteInput" label={`Enter ${initialFolderNameInputValue} to delete the folder`} placeholder="Enter folder name" value={folderNameDeleteInputValue} onChange={e => setFolderNameDeleteInputValue(e.target.value)} />
          <Button variant="outlined" disabled={folderNameDeleteInputValue !== initialFolderNameInputValue} onClick={handleDeleteFolder}>Delete folder</Button>
        </div>
      </Modal>
    </div>
  );
};
