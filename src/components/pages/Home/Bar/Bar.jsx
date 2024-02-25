import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateDocuments } from 'redux/features/user/userSlice';
import { db } from 'firebase.js';
import { doc, setDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

import { Tooltip } from 'components/atoms/Tooltip/Tooltip';
import { IconButton } from 'components/atoms/IconButton/IconButton';
import { Modal } from 'components/atoms/Modal/Modal';
import { Input } from 'components/atoms/Input/Input';
import { Button } from 'components/atoms/Button/Button';

import css from './Bar.module.css';

export const Bar = () => {
  const dispatch = useDispatch();
  const { userId, documents, path } = useSelector(state => state.user);

  const [folderInputValue, setFolderNameInput] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);


  const handleAddFolder = async (text) => {
    setLoading(true);

    const newFolder = {
      id: uuidv4(),
      text,
      folders: [],
      nots: [],
      tasks: []
    };

    const newDocuments = JSON.parse(JSON.stringify(documents));

    function findFolder(object, id, newObject) {
      if (object.id === id) {
        object.folders.push(newObject);
        return true;
      } else if (object.folders && object.folders.length > 0) {
        for (let i = 0; i < object.folders.length; i++) {
          if (findFolder(object.folders[i], id, newObject)) {
            return true;
          }
        }
      }

      return false;
    }

    findFolder(newDocuments, path[path.length - 1], newFolder);

    await setDoc(doc(db, 'users', userId), { documents: newDocuments }, { merge: true })
      .then(() => {
        dispatch(updateDocuments(newDocuments));
        setLoading(false);
        setOpen(false);
        setFolderNameInput('');
      })
      .catch(err => console.log(err));
  };

  const handleTheme = () => {
    const body = document.body;

    if (body.classList.contains('light-theme')) {
      body.classList.remove('light-theme');
      body.classList.add('dark-theme');
    }
    else {
      body.classList.remove('dark-theme');
      body.classList.add('light-theme');
    }
  };

  return (
    <div className={css.container}>
      <div className={css.start}>
        <Tooltip position="right" text="Add Note">
          <IconButton primary size="large" path="M460-460H240v-40h220v-220h40v220h220v40H500v220h-40v-220Z" />
        </Tooltip>
        <Tooltip position="right" text="Add Task">
          <IconButton path="m382-267.692-198.769-198.77L211.769-495 382-324.769 748.231-691l28.538 28.538L382-267.692Z" />
        </Tooltip>
        <Tooltip position="right" text="Add Folder">
          <IconButton onClick={() => setOpen(true)} path="M120-200v-560h263.846l80 80H840v480H120Zm40-40h640v-400H447.769l-80-80H160v480Zm0 0v-480 480Z" />
        </Tooltip>
        <Modal
          loading={loading}
          open={open}
          setOpen={setOpen}
        >
          <div className={css.createFolderModalContent}>
            <Input label="Folder name" autofocus placeholder="Enter folder name" value={folderInputValue} onChange={e => setFolderNameInput(e.target.value)} />
            <Button text="Create folder" disabled={!folderInputValue} onClick={() => handleAddFolder(folderInputValue)} />
          </div>
        </Modal>
      </div>
      <div className={css.end}>
        <Tooltip position="right" text="Theme">
          <IconButton onClick={handleTheme} path="M482.308-160q-133.334 0-226.667-93.333Q162.307-346.667 162.307-480q0-121.539 79.231-210.77Q320.769-780 437.693-796.154q3.23 0 6.346.231 3.115.23 6.115.692-20.231 28.231-32.038 62.808-11.808 34.577-11.808 72.423 0 106.667 74.667 181.333Q555.641-404 662.308-404q38.077 0 72.538-11.808 34.462-11.808 61.923-32.039.462 3 .693 6.116.231 3.115.231 6.346-15.385 116.923-104.616 196.154T482.308-160Zm0-40q88 0 158-48.5t102-126.5q-20 5-40 8t-40 3q-123 0-209.5-86.5t-86.5-209.5q0-20 3-40t8-40q-78 32-126.5 102t-48.5 158q0 116 82 198t198 82Zm-10-270Z" />
        </Tooltip>
        <Tooltip position="right" text="User">
          <IconButton path="M480-504.615q-49.5 0-84.75-35.25T360-624.615q0-49.501 35.25-84.751 35.25-35.25 84.75-35.25t84.75 35.25Q600-674.116 600-624.615q0 49.5-35.25 84.75T480-504.615ZM200-215.384v-65.847q0-24.769 14.423-46.346 14.423-21.577 38.808-33.5 56.615-27.154 113.307-40.731Q423.231-415.385 480-415.385q56.769 0 113.462 13.577 56.692 13.577 113.307 40.731 24.385 11.923 38.808 33.5Q760-306 760-281.231v65.847H200Zm40-40.001h480v-25.846q0-13.307-8.577-25-8.577-11.692-23.731-19.769-49.384-23.923-101.836-36.654Q533.405-375.385 480-375.385q-53.405 0-105.856 12.731Q321.692-349.923 272.308-326q-15.154 8.077-23.731 19.769-8.577 11.693-8.577 25v25.846Zm240-289.23q33 0 56.5-23.5t23.5-56.5q0-33-23.5-56.5t-56.5-23.5q-33 0-56.5 23.5t-23.5 56.5q0 33 23.5 56.5t56.5 23.5Zm0-80Zm0 369.23Z" />
        </Tooltip>
        <Tooltip position="right" text="Info">
          <IconButton path="M481.12-270.769q13.265 0 22.38-9.159 9.115-9.159 9.115-22.423 0-13.264-9.158-22.38-9.159-9.115-22.423-9.115-13.265 0-22.38 9.159-9.116 9.158-9.116 22.423 0 13.264 9.159 22.38 9.159 9.115 22.423 9.115Zm-20.659-132.462h38.616q1.538-26.077 9.808-42.384 8.269-16.308 34.038-41.616 26.769-26.769 39.846-47.961 13.077-21.193 13.077-49.059 0-47.288-33.229-75.365-33.23-28.077-78.617-28.077-43.154 0-73.269 23.462-30.116 23.462-44.116 53.923l36.77 15.231q9.615-21.846 27.5-38.615 17.884-16.77 51.577-16.77 38.923 0 56.846 21.347 17.923 21.346 17.923 46.961 0 20.769-11.231 37.115-11.231 16.347-29.231 32.885-34.769 32.077-45.538 54.385-10.77 22.307-10.77 54.538ZM480.134-120q-74.673 0-140.41-28.339-65.737-28.34-114.365-76.922-48.627-48.582-76.993-114.257Q120-405.194 120-479.866q0-74.673 28.339-140.41 28.34-65.737 76.922-114.365 48.582-48.627 114.257-76.993Q405.194-840 479.866-840q74.673 0 140.41 28.339 65.737 28.34 114.365 76.922 48.627 48.582 76.993 114.257Q840-554.806 840-480.134q0 74.673-28.339 140.41-28.34 65.737-76.922 114.365-48.582 48.627-114.257 76.993Q554.806-120 480.134-120ZM480-160q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
        </Tooltip>
        <Tooltip position="right" text="Settings">
          <IconButton path="m405.384-120-14.461-115.692q-19.154-5.769-41.423-18.154-22.269-12.385-37.885-26.538L204.923-235l-74.616-130 92.231-69.539q-1.769-10.846-2.923-22.346-1.154-11.5-1.154-22.346 0-10.077 1.154-21.192t2.923-25.038L130.307-595l74.616-128.462 105.923 44.616q17.923-14.923 38.769-26.923 20.846-12 40.539-18.539L405.384-840h149.232l14.461 116.461q23 8.077 40.654 18.539 17.654 10.461 36.346 26.154l109-44.616L829.693-595l-95.308 71.846q3.308 12.385 3.692 22.731.385 10.346.385 20.423 0 9.308-.769 19.654-.77 10.346-3.539 25.038L827.923-365l-74.615 130-107.231-46.154q-18.692 15.693-37.615 26.923-18.923 11.231-39.385 17.77L554.616-120H405.384ZM440-160h78.231L533-268.308q30.231-8 54.423-21.961 24.192-13.962 49.269-38.269L736.462-286l39.769-68-87.539-65.769q5-17.077 6.616-31.423 1.615-14.346 1.615-28.808 0-15.231-1.615-28.808-1.616-13.577-6.616-29.884L777.769-606 738-674l-102.077 42.769q-18.154-19.923-47.731-37.346t-55.961-23.115L520-800h-79.769l-12.462 107.538q-30.231 6.462-55.577 20.808-25.346 14.346-50.423 39.423L222-674l-39.769 68L269-541.231q-5 13.462-7 29.231-2 15.769-2 32.769Q260-464 262-449q2 15 6.231 29.231l-86 65.769L222-286l99-42q23.538 23.769 48.885 38.115 25.346 14.347 57.115 22.347L440-160Zm38.923-220q41.846 0 70.923-29.077 29.077-29.077 29.077-70.923 0-41.846-29.077-70.923Q520.769-580 478.923-580q-42.077 0-71.039 29.077-28.961 29.077-28.961 70.923 0 41.846 28.961 70.923Q436.846-380 478.923-380ZM480-480Z" />
        </Tooltip>
      </div>
    </div>
  );
};