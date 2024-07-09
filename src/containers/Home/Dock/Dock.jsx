import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme, setModalGlobalSettings, setAddFolderModal, setNoteModal } from 'redux/features/app/appSlice';
import { createInTreeThunk, setActiveTaskId } from 'redux/features/tree/treeSlice';
import { setActiveNote } from 'redux/features/note/noteSlice';
import { v4 as uuidv4 } from 'uuid';

import { Avatar, Button, IconButton, Input, Modal, Tooltip } from 'components';
import { Settings } from './Settings/Settings';

import css from './Dock.module.css';

import { PLUS, TASK, FOLDER, DARK, LIGHT, SETTINGS } from 'utils/variables';

export const Dock = () => {
  const dispatch = useDispatch();

  const { windowWidth, theme, addFolderModal } = useSelector(state => state.app);
  const { userEmail, userPhoto, userName, documents } = useSelector(state => state.user);
  const { activeNoteId } = useSelector(state => state.note);

  const dockRef = useRef(null);

  const [folderNameInputValue, setFolderNameInput] = useState('');

  useEffect(() => {
    const updateBottomOffset = () => {
      if (window.visualViewport) {
        dockRef.current.style.bottom = `${window.visualViewport.height - window.innerHeight}px`;
        // dockRef.current.style.bottom = (window.innerHeight - window.visualViewport.height - window.visualViewport.offsetTop) + 'px';
      }
    };

    updateBottomOffset();
    window.visualViewport.addEventListener('resize', updateBottomOffset);
    window.visualViewport.addEventListener('scroll', updateBottomOffset);

    return () => {
      window.visualViewport.removeEventListener('resize', updateBottomOffset);
      window.visualViewport.removeEventListener('scroll', updateBottomOffset);
    };
  }, []);

  const handleCreateFolder = () => {
    const newFolder = {
      id: uuidv4(),
      name: folderNameInputValue,
      folders: [],
      notes: [],
      tasks: []
    };

    dispatch(createInTreeThunk({ type: 'folders', obj: newFolder }));

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

    windowWidth <= 480 && (window.location.hash = 'editor');
    dispatch(setNoteModal(true));
  };

  const handleCreateTask = () => {
    const newTaskId = uuidv4();

    const newTask = {
      id: newTaskId,
      content: ''
    };

    // Creates only localy! Saving on task blur
    dispatch(createInTreeThunk({ type: 'tasks', obj: newTask }));
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
    windowWidth <= 480 && (window.location.hash = 'addFolder');
    dispatch(setAddFolderModal(true));
  };

  const handleCloseAddFolder = () => {
    windowWidth <= 480 ? window.history.back() : dispatch(setAddFolderModal(false));
    setFolderNameInput('');
  };

  const handleOpenSettings = () => {
    windowWidth <= 480 && (window.location.hash = 'settings');
    dispatch(setModalGlobalSettings(true));
  };

  const RichTooltipContent = () => {
    return (
      <div className={css.richTooltipContent}>
        <span>You have several options to get started:</span>
        <ul className={css.richTooltipList}>
          <li className={css.richTooltipListItem}>Create a <b>Folder</b> to organize your data</li>
          <li className={css.richTooltipListItem}>Add a <b>Note</b> to jot down anything you want</li>
          <li className={css.richTooltipListItem}>Start by adding some <b>Tasks</b></li>
        </ul>
      </div>
    );
  };

  return (
    <div ref={dockRef} className={css.container}>
      <Tooltip
        isRich
        isRichVisible={(documents?.folders.length === 0 && documents?.notes.length === 0 && documents?.tasks.length === 0 && !activeNoteId) ? true : false}
        preferablePosition={windowWidth > 480 ? "rightTop" : "topRight"}
        offset={16}
        title="Welcome to Omniumicon!"
        content={<RichTooltipContent />}
      >
        <div className={css.start}>
          <Tooltip preferablePosition="right" content="Add Note">
            <IconButton variant="primary" path={PLUS} onClick={handleCreateNote} />
          </Tooltip>
          <Tooltip preferablePosition="right" content="Add Task">
            <IconButton variant="secondary" path={TASK} onClick={handleCreateTask} />
          </Tooltip>
          <Tooltip preferablePosition="right" content="Add Folder">
            <IconButton variant="secondary" path={FOLDER} onClick={handleOpenAddFolder} />
          </Tooltip>
        </div>
      </Tooltip>
      <div className={css.end}>
        <span className={css.hideOnMobile}>
          <Tooltip preferablePosition="right" content="Theme">
            {theme === "light"
              ? <IconButton variant="secondary" path={LIGHT} onClick={handleTheme} />
              : <IconButton variant="secondary" path={DARK} onClick={handleTheme} />
            }
          </Tooltip>
        </span>
        <span className={css.hideOnMobile}>
          <Tooltip preferablePosition="right" content="Settings">
            <IconButton variant="secondary" path={SETTINGS} onClick={handleOpenSettings} />
          </Tooltip>
        </span>
        <Tooltip preferablePosition="right" content={userName || userEmail}>
          <Avatar src={userPhoto} alt="avatar" size="small" onClick={handleOpenSettings} />
        </Tooltip>
      </div>
      <Modal open={addFolderModal} close={handleCloseAddFolder} stickToTop={true}>
        <div className={css.createFolderModalContent}>
          <Input id="folderNameId" label="Folder name" autofocus placeholder="Enter folder name" value={folderNameInputValue} onChange={e => setFolderNameInput(e.target.value)} onEnter={handleCreateFolder} />
          <Button variant="outlined" disabled={!folderNameInputValue} onClick={handleCreateFolder}>Create folder</Button>
        </div>
      </Modal>
      <Settings />
    </div >
  );
};
