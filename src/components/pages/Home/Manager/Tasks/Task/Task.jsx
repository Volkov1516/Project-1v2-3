import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSnackbar } from 'redux/features/app/appSlice';
import { setActiveTaskId, updateDocuments } from 'redux/features/user/userSlice';
import { db } from 'firebase.js';
import { doc, setDoc } from 'firebase/firestore';

import { IconButton } from 'components/atoms/IconButton/IconButton';

import css from './Task.module.css';

import { findFolder } from 'utils/findFolder';

export const Task = ({ id, content, isDraggable }) => {
  const dispatch = useDispatch();

  const textareaRef = useRef(null);

  const { userId, documents, path, activeTaskId } = useSelector(state => state.user);

  const [value, setValue] = useState(content);

  useEffect(() => {
    // if(!isDraggable) {
    //   textareaRef.current.style.height = 'auto';
    //   textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    // }
  }, [id, isDraggable]);

  const handleDeleteTask = async () => {
    try {
      const newDocuments = JSON.parse(JSON.stringify(documents));

      const deleteTask = (targetFolder) => {
        if (targetFolder.tasks && targetFolder.tasks.length > 0) {
          for (let i = 0; i < targetFolder.tasks.length; i++) {
            if (targetFolder.tasks[i].id === id) {
              targetFolder.tasks.splice(i, 1);
              return;
            }
          }
        }
      };

      findFolder(newDocuments, path[path.length - 1], deleteTask);

      dispatch(updateDocuments(newDocuments));

      await setDoc(doc(db, 'users', userId), { documents: newDocuments }, { merge: true });

      dispatch(setSnackbar('Task was completed'));
    } catch (error) {
      dispatch(setSnackbar('Failed to delete the task'));
    }
  };

  const handleOnChange = (e) => {
    setValue(e.target.value);

    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  };

  const handleOnBlur = async (e) => {
    if (!value) {
      handleDeleteTask();
    }
    else {
      try {
        const newDocuments = JSON.parse(JSON.stringify(documents));

        const createTask = (targetFolder) => {
          if (targetFolder.tasks && targetFolder.tasks.length > 0) {
            for (let i = 0; i < targetFolder.tasks.length; i++) {
              if (targetFolder.tasks[i].id === id) {
                targetFolder.tasks[i].content = e.target.value;
              }
            }
          }
        };

        findFolder(newDocuments, path[path.length - 1], createTask);

        dispatch(updateDocuments(newDocuments));

        await setDoc(doc(db, 'users', userId), { documents: newDocuments }, { merge: true });

        dispatch(setSnackbar('Task was saved'));
      } catch (error) {
        dispatch(setSnackbar('Failed to save the task'));
      }
    }

    dispatch(setActiveTaskId(null));
  };

  return (
    <div className={css.container}>
      <IconButton onClick={handleDeleteTask} path="M480.134-120q-74.673 0-140.41-28.339-65.737-28.34-114.365-76.922-48.627-48.582-76.993-114.257Q120-405.194 120-479.866q0-74.673 28.339-140.41 28.34-65.737 76.922-114.365 48.582-48.627 114.257-76.993Q405.194-840 479.866-840q74.673 0 140.41 28.339 65.737 28.34 114.365 76.922 48.627 48.582 76.993 114.257Q840-554.806 840-480.134q0 74.673-28.339 140.41-28.34 65.737-76.922 114.365-48.582 48.627-114.257 76.993Q554.806-120 480.134-120ZM480-160q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
      {/* {isDraggable
        ? (<p>{value}</p>)
        : (<textarea
          ref={textareaRef}
          className={css.textarea}
          name="task"
          autoFocus={id === activeTaskId}
          rows={1}
          value={value}
          onChange={handleOnChange}
          onBlur={handleOnBlur}
        />)
      } */}
      <div className={css.content} contentEditable={!isDraggable}>
        {value}
      </div>
    </div>
  );
};
