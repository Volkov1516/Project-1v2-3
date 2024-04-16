import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme, setSettingsModal, setAddFolderModal, setNoteModal } from 'redux/features/app/appSlice';
import { createInDocuments, setActiveTaskId } from 'redux/features/user/userSlice';
import { setActiveNote } from 'redux/features/note/noteSlice';
import { v4 as uuidv4 } from 'uuid';

import { Settings } from './Settings/Settings';
import { Tooltip } from 'components/atoms/Tooltip/Tooltip';
import { IconButton } from 'components/atoms/IconButton/IconButton';
import { Modal } from 'components/atoms/Modal/Modal';
import { Input } from 'components/atoms/Input/Input';
import { Button } from 'components/atoms/Button/Button';

import css from './Bar.module.css';

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

    window.history.back();
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
          <IconButton onClick={handleCreateNote} primary size="large" path="M460-460H240v-40h220v-220h40v220h220v40H500v220h-40v-220Z" />
        </Tooltip>
        <Tooltip position="right" text="Add Task">
          <IconButton onClick={handleCreateTask} path="m382-267.692-198.769-198.77L211.769-495 382-324.769 748.231-691l28.538 28.538L382-267.692Z" />
        </Tooltip>
        <Tooltip position="right" text="Add Folder">
          <IconButton onClick={handleOpenAddFolder} path="M120-200v-560h263.846l80 80H840v480H120Zm40-40h640v-400H447.769l-80-80H160v480Zm0 0v-480 480Z" />
        </Tooltip>
      </div>
      <div className={css.end}>
        <span className={css.hideOnMobile}>
          <Tooltip position="right" text="Theme">
            {theme === 'light'
              ? <IconButton onClick={handleTheme} path="M480-360q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Zm0 40q-66.846 0-113.423-46.577T320-480q0-66.846 46.577-113.423T480-640q66.846 0 113.423 46.577T640-480q0 66.846-46.577 113.423T480-320ZM200-460H60v-40h140v40Zm700 0H760v-40h140v40ZM460-760v-140h40v140h-40Zm0 700v-140h40v140h-40ZM269.846-663.846l-86.385-83.923 27.77-29.77 84.461 85.385-25.846 28.308Zm478.923 481.385-84.692-85.616 26.077-28.077 86.385 83.923-27.77 29.77Zm-84.923-507.693 83.923-86.385 29.77 27.77-85.385 84.461-28.308-25.846ZM182.461-211.231l85.616-84.692 26.538 26.077-83.153 87.154-29.001-28.539ZM480-480Z" />
              : <IconButton onClick={handleTheme} path="M482.308-160q-133.334 0-226.667-93.333Q162.307-346.667 162.307-480q0-121.539 79.231-210.77Q320.769-780 437.693-796.154q3.23 0 6.346.231 3.115.23 6.115.692-20.231 28.231-32.038 62.808-11.808 34.577-11.808 72.423 0 106.667 74.667 181.333Q555.641-404 662.308-404q38.077 0 72.538-11.808 34.462-11.808 61.923-32.039.462 3 .693 6.116.231 3.115.231 6.346-15.385 116.923-104.616 196.154T482.308-160Zm0-40q88 0 158-48.5t102-126.5q-20 5-40 8t-40 3q-123 0-209.5-86.5t-86.5-209.5q0-20 3-40t8-40q-78 32-126.5 102t-48.5 158q0 116 82 198t198 82Zm-10-270Z" />
            }
          </Tooltip>
        </span>
        <span className={css.hideOnMobile}>
          <Tooltip position="right" text="Settings">
            <IconButton onClick={handleOpenSettings} path="m405.384-120-14.461-115.692q-19.154-5.769-41.423-18.154-22.269-12.385-37.885-26.538L204.923-235l-74.616-130 92.231-69.539q-1.769-10.846-2.923-22.346-1.154-11.5-1.154-22.346 0-10.077 1.154-21.192t2.923-25.038L130.307-595l74.616-128.462 105.923 44.616q17.923-14.923 38.769-26.923 20.846-12 40.539-18.539L405.384-840h149.232l14.461 116.461q23 8.077 40.654 18.539 17.654 10.461 36.346 26.154l109-44.616L829.693-595l-95.308 71.846q3.308 12.385 3.692 22.731.385 10.346.385 20.423 0 9.308-.769 19.654-.77 10.346-3.539 25.038L827.923-365l-74.615 130-107.231-46.154q-18.692 15.693-37.615 26.923-18.923 11.231-39.385 17.77L554.616-120H405.384ZM440-160h78.231L533-268.308q30.231-8 54.423-21.961 24.192-13.962 49.269-38.269L736.462-286l39.769-68-87.539-65.769q5-17.077 6.616-31.423 1.615-14.346 1.615-28.808 0-15.231-1.615-28.808-1.616-13.577-6.616-29.884L777.769-606 738-674l-102.077 42.769q-18.154-19.923-47.731-37.346t-55.961-23.115L520-800h-79.769l-12.462 107.538q-30.231 6.462-55.577 20.808-25.346 14.346-50.423 39.423L222-674l-39.769 68L269-541.231q-5 13.462-7 29.231-2 15.769-2 32.769Q260-464 262-449q2 15 6.231 29.231l-86 65.769L222-286l99-42q23.538 23.769 48.885 38.115 25.346 14.347 57.115 22.347L440-160Zm38.923-220q41.846 0 70.923-29.077 29.077-29.077 29.077-70.923 0-41.846-29.077-70.923Q520.769-580 478.923-580q-42.077 0-71.039 29.077-28.961 29.077-28.961 70.923 0 41.846 28.961 70.923Q436.846-380 478.923-380ZM480-480Z" />
          </Tooltip>
        </span>
        {userPhoto ?
          <Tooltip position="right" text={userName || userEmail}>
            <div onClick={handleOpenSettings} className={css.photoWrapper}>
              <img className={css.photo} src={userPhoto} alt="avatar" />
            </div>
          </Tooltip> :
          <Tooltip position="right" text={userName || userEmail}>
            <IconButton onClick={handleOpenSettings} path="M480-504.615q-49.5 0-84.75-35.25T360-624.615q0-49.501 35.25-84.751 35.25-35.25 84.75-35.25t84.75 35.25Q600-674.116 600-624.615q0 49.5-35.25 84.75T480-504.615ZM200-215.384v-65.847q0-24.769 14.423-46.346 14.423-21.577 38.808-33.5 56.615-27.154 113.307-40.731Q423.231-415.385 480-415.385q56.769 0 113.462 13.577 56.692 13.577 113.307 40.731 24.385 11.923 38.808 33.5Q760-306 760-281.231v65.847H200Zm40-40.001h480v-25.846q0-13.307-8.577-25-8.577-11.692-23.731-19.769-49.384-23.923-101.836-36.654Q533.405-375.385 480-375.385q-53.405 0-105.856 12.731Q321.692-349.923 272.308-326q-15.154 8.077-23.731 19.769-8.577 11.693-8.577 25v25.846Zm240-289.23q33 0 56.5-23.5t23.5-56.5q0-33-23.5-56.5t-56.5-23.5q-33 0-56.5 23.5t-23.5 56.5q0 33 23.5 56.5t56.5 23.5Zm0-80Zm0 369.23Z" />
          </Tooltip>
        }
      </div>
      <Modal open={addFolderModal} close={handleCloseAddFolder}>
        <div className={css.createFolderModalContent}>
          <Input id="folderNameId" label="Folder name" autofocus placeholder="Enter folder name" value={folderInputValue} onChange={e => setFolderNameInput(e.target.value)} />
          <Button type="outlined" disabled={!folderInputValue} onClick={handleCreateFolder}>Create folder</Button>
        </div>
      </Modal>
      <Settings />
    </div >
  );
};
