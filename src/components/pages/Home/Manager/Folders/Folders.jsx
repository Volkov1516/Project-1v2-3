import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAppPathname } from 'redux/features/app/appSlice';
import { deleteFromDocuments, updateInDocuments } from 'redux/features/user/userSlice';

import { IconButton } from 'components/atoms/IconButton/IconButton';
import { Input } from 'components/atoms/Input/Input';
import { Button } from 'components/atoms/Button/Button';
import { Modal } from 'components/atoms/Modal/Modal';

import css from './Folders.module.css';

import { addNavigationSegment } from 'utils/setNavigation';

export const Folders = ({ folders, preventOnClick, windowWidth, handleTouchStart, handleTouchEnd, handleTouchMove }) => {
  const dispatch = useDispatch();

  const { appPathname } = useSelector(state => state.app);

  const [folderIdEditFolderModal, setFoldeIdEditFolderModal] = useState(null);
  const [folderInputValue, setFolderInputValue] = useState('');
  const [folderDeleteValue, setFolderDeleteValue] = useState('');
  const [folderDeleteInputValue, setFolderDeleteInputValue] = useState('');

  const handleOpenFolder = (id) => {
    if (preventOnClick) return;

    const pathname = window.location.pathname;

    if (pathname.includes('folder')) {
      let newPathname = pathname.split('/');
      newPathname[1] = newPathname[1].split('=')[1] = `folder=${id}`;

      window.history.pushState({}, '', newPathname.join('/'));
      dispatch(setAppPathname(newPathname.join('/')));
    }
    else {
      addNavigationSegment(dispatch, `folder=${id}`);
    }
  };

  const handleOpenEditFodlerModal = (e, id, name) => {
    setFoldeIdEditFolderModal(id);
    setFolderInputValue(name);
    setFolderDeleteValue(name);

    addNavigationSegment(dispatch, 'editFolder');
  };

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
    window.history.back();
  };

  return (
    <div id="folder" className={css.container}>
      {windowWidth < 639
        ? folders?.map((i, index) => (
          <div
            key={i.id}
            id={i.id}
            className={css.folder}
            data-index={index}
            data-id={i.id}
            data-draggable={true}
            data-type="folder"
            onClick={() => handleOpenFolder(i.id)}
            onTouchStart={e => handleTouchStart(e, index, i.id, "folder", i.name, handleOpenEditFodlerModal)}
            onTouchEnd={e => handleTouchEnd(e)}
            onTouchMove={e => handleTouchMove(e, index, i.id, "folder", i.name)}
          >
            <div className={css.start}>
              <svg className={css.svg} viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                <path d="M853.333333 256H469.333333l-85.333333-85.333333H170.666667c-46.933333 0-85.333333 38.4-85.333334 85.333333v170.666667h853.333334v-85.333334c0-46.933333-38.4-85.333333-85.333334-85.333333z" fill="#FFA000" /><path d="M853.333333 256H170.666667c-46.933333 0-85.333333 38.4-85.333334 85.333333v426.666667c0 46.933333 38.4 85.333333 85.333334 85.333333h682.666666c46.933333 0 85.333333-38.4 85.333334-85.333333V341.333333c0-46.933333-38.4-85.333333-85.333334-85.333333z" fill="#FFCA28" />
              </svg>
              {i.name}
            </div>
          </div>
        ))
        : folders?.map((i, index) => (
          <div
            key={i.id}
            id={i.id}
            className={css.folder}
            data-index={index}
            data-id={i.id}
            data-draggable={true}
            data-type="folder"
            onClick={() => handleOpenFolder(i.id)}
            onMouseDown={e => handleTouchStart(e, index, i.id, "folder", i.name, handleOpenEditFodlerModal)}
            onMouseUp={e => handleTouchEnd(e)}
            onMouseMove={e => handleTouchMove(e, index, i.id, "folder", i.name)}
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
        ))
      }
      {appPathname?.includes('editFolder') && <Modal>
        <div className={css.eiditFolderModalContent}>
          <Input id="folderNameId" label="Edit folder name" placeholder="Enter folder name" value={folderInputValue} onChange={e => setFolderInputValue(e.target.value)} />
          <Button type="outlined" disabled={!folderInputValue} onClick={handleEditFolderName}>Rename folder</Button>
          <Input id="folderDleteId" label={`Enter ${folderDeleteValue} to delete the folder`} placeholder="Enter folder name" value={folderDeleteInputValue} onChange={e => setFolderDeleteInputValue(e.target.value)} />
          <Button type="outlined" disabled={folderDeleteValue !== folderDeleteInputValue} onClick={handleDeleteFolder}>Delete folder</Button>
        </div>
      </Modal>}
    </div>
  );
};
