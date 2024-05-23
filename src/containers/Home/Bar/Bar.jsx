import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme, setSettingsModal, setAddFolderModal, setNoteModal } from 'redux/features/app/appSlice';
import { createInDocuments, setActiveTaskId } from 'redux/features/user/userSlice';
import { setActiveNote } from 'redux/features/note/noteSlice';
import { v4 as uuidv4 } from 'uuid';

import { Settings } from './Settings/Settings';
import { Tooltip } from 'components/Tooltip/Tooltip';
import { IconButton } from 'components/IconButton/IconButton';
import { Modal } from 'components/Modal/Modal';
import { Input } from 'components/Input/Input';
import { Button } from 'components/Button/Button';

import css from './Bar.module.css';

import { PLUS, TASK, FOLDER, DARK, LIGHT, SETTINGS, USER } from 'utils/variables';

export const Bar = () => {
  const dispatch = useDispatch();

  const { windowWidth, theme, addFolderModal } = useSelector(state => state.app);
  const { userEmail, userPhoto, userName } = useSelector(state => state.user);

  const [folderInputValue, setFolderNameInput] = useState('');

  const handleCreateFolder = () => {
    const newFolder = {
      id: uuidv4(),
      name: folderInputValue,
      folders: [],
      notes: [],
      tasks: []
    };

    dispatch(createInDocuments({ type: 'folders', obj: newFolder }));

    handleCloseAddFolder();
  };

  const handleCreateNote = () => {
    const newId = uuidv4();

    dispatch(setActiveNote({
      isNew: true,
      id: newId,
      title: '',
      content: '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
    }));

    windowWidth < 639 && (window.location.hash = 'note');
    dispatch(setNoteModal(true));
  };

  const handleCreateTask = () => {
    const newTaskId = uuidv4();

    const newTask = {
      id: newTaskId,
      content: ''
    };

    // Creates only localy! Saving on task blur
    dispatch(createInDocuments({ type: 'tasks', obj: newTask }));
    dispatch(setActiveTaskId(newTaskId));
  };

  const handleTheme = () => {
    const body = document.body;

    if (theme === 'light') {
      localStorage.setItem('theme', 'dark');
      dispatch(setTheme('dark'));

      body.classList.remove('light-theme');
      body.classList.add('dark-theme');

      const themeTag = document.querySelector('meta[name="theme-color"]');
      themeTag.setAttribute('content', '#191919');
    }
    else if (theme === 'dark') {
      localStorage.setItem('theme', 'light');
      dispatch(setTheme('light'));

      body.classList.remove('dark-theme');
      body.classList.add('light-theme');

      const themeTag = document.querySelector('meta[name="theme-color"]');
      themeTag.setAttribute('content', '#FFFFFF');
    }
  };

  const handleOpenAddFolder = () => {
    windowWidth < 639 && (window.location.hash = 'addFolder');
    dispatch(setAddFolderModal(true));
  };

  const handleCloseAddFolder = () => windowWidth < 639 ? window.history.back() : dispatch(setAddFolderModal(false));

  const handleOpenSettings = () => {
    windowWidth < 639 && (window.location.hash = 'settings');
    dispatch(setSettingsModal(true));
  };

  return (
    <div className={css.container}>
      <div className={css.start}>
        <Tooltip position="right" text="Add Note">
          <IconButton onClick={handleCreateNote} primary size="large" path={PLUS} />
        </Tooltip>
        <Tooltip position="right" text="Add Task">
          <IconButton onClick={handleCreateTask} path={TASK} />
        </Tooltip>
        <Tooltip position="right" text="Add Folder">
          <IconButton onClick={handleOpenAddFolder} path={FOLDER} />
        </Tooltip>
      </div>
      <div className={css.end}>
        <span className={css.hideOnMobile}>
          <Tooltip position="right" text="Theme">
            {theme === 'light'
              ? <IconButton onClick={handleTheme} path={LIGHT} />
              : <IconButton onClick={handleTheme} path={DARK} />
            }
          </Tooltip>
        </span>
        <span className={css.hideOnMobile}>
          <Tooltip position="right" text="Settings">
            <IconButton onClick={handleOpenSettings} path={SETTINGS} />
          </Tooltip>
        </span>
        {userPhoto ?
          <Tooltip position="right" text={userName || userEmail}>
            <div onClick={handleOpenSettings} className={css.photoWrapper}>
              <img className={css.photo} src={userPhoto} alt="avatar" />
            </div>
          </Tooltip> :
          <Tooltip position="right" text={userName || userEmail}>
            <IconButton onClick={handleOpenSettings} path={USER} />
          </Tooltip>
        }
      </div>
      <Modal open={addFolderModal} close={handleCloseAddFolder}>
        <div className={css.createFolderModalContent}>
          <Input id="folderNameId" label="Folder name" autofocus placeholder="Enter folder name" value={folderInputValue} onChange={e => setFolderNameInput(e.target.value)} />
          <Button variant="outlined" disabled={!folderInputValue} onClick={handleCreateFolder}>Create folder</Button>
        </div>
      </Modal>
      <Settings />
    </div >
  );
};
