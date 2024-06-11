import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSnackbar, setEditNoteModal, setNoteModal } from 'redux/features/app/appSlice';
import { updateInDocuments, deleteFromDocuments } from 'redux/features/user/userSlice';
import { updateNotesCache, setActiveNote, updateActiveNoteTitle } from 'redux/features/note/noteSlice';
import { db } from 'services/firebase.js';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';

import { Button } from 'components/Button/Button';
import { IconButton } from 'components/IconButton/IconButton';
import { Tooltip } from 'components/Tooltip/Tooltip';
import { Input } from 'components/Input/Input';
import { Modal } from 'components/Modal/Modal';
import { DragAdnDropElement } from 'components/DragAndDrop/DragAndDropElement';

import { useDragAndDrop } from 'components/DragAndDrop/DragAndDropContext';

import css from './Notes.module.css';

import { DOC, MORE_VERTICAL } from 'utils/variables';

export const Notes = ({ notes }) => {
  const { preventOnClick } = useDragAndDrop();

  const dispatch = useDispatch();

  const { windowWidth, editNoteModal } = useSelector(state => state.app);
  const { notesCache, activeNoteId } = useSelector(state => state.note);

  const [noteIdEditNoteModal, setNoteIdEditNoteModal] = useState(null);
  const [initialTitleInputValue, setInitialTitleInputValue] = useState('');
  const [titleInputValue, setTitleInputValue] = useState('');
  const [titleDeleteValue, setTitleDeleteValue] = useState('');
  const [titleDeleteInputValue, setTitleDeleteInputValue] = useState('');

  const handleTouchStart = e => e.currentTarget.classList.add(css.touch);

  const handleTouchEnd = e => e.currentTarget.classList.remove(css.touch);

  const handleOpenNote = async (id) => {
    // Prevent onClick after mouseUp
    if (preventOnClick) return;

    // STEP 1: Return if this note is openned (need to clean up activeNoteId after close!)
    // if (activeNoteId === id) return;

    // STEP 2: Check if Note is in the Redux
    let targetNote = notesCache?.find(i => i.id === id);

    // STEP 3: If no - fetch the Note, cache it to Redux and apply for targetNote
    if (!targetNote) {
      try {
        const docRef = doc(db, 'notes', id);
        const docSnap = await getDoc(docRef);

        let newNotesCache;
        let newNote = {
          id: docSnap.id,
          title: docSnap?.data()?.title,
          content: docSnap?.data()?.content,
        };

        targetNote = newNote;

        if (Array.isArray(notesCache)) {
          const notesCacheCopy = JSON.parse(JSON.stringify(notesCache));
          notesCacheCopy.push(newNote);
          newNotesCache = notesCacheCopy;
        }
        else {
          newNotesCache = [newNote];
        }

        dispatch(updateNotesCache(newNotesCache));
      } catch (error) {
        dispatch(setSnackbar('Faild to open the note'));
        return;
      }
    }

    // STEP 4: Open Editor with targetNote data
    dispatch(setActiveNote({
      isNew: false,
      id: targetNote?.id,
      title: targetNote?.title,
      content: targetNote?.content,
    }));
    dispatch(setNoteModal(true));

    // STEP 5: Update URL
    windowWidth <= 480 && (window.location.hash = 'editor');
  };

  const handleOpenEditNoteModal = (e, id, title) => {
    e.stopPropagation();

    setNoteIdEditNoteModal(id);
    setInitialTitleInputValue(title);
    setTitleInputValue(title);
    setTitleDeleteValue(title);

    windowWidth <= 480 && (window.location.hash = 'editNote');
    dispatch(setEditNoteModal(true));
  };

  const handleCloseEditNote = () => {
    windowWidth <= 480 ? window.history.back() : dispatch(setEditNoteModal(false));
    setTitleInputValue('');
    setTitleDeleteValue(null);
    setTitleDeleteInputValue('');
  };

  const handleEditNoteTitle = async () => {
    // STEP 1: Return if no changes
    if (titleInputValue === titleDeleteValue) return;

    if (titleInputValue && titleInputValue.length > 0) {
      try {
        // STEP 2: Update title in user.documents (Redux, Firebase)
        dispatch(updateInDocuments({ type: 'notes', id: noteIdEditNoteModal, name: 'title', value: titleInputValue }));

        // STEP 3: Update title in notes (Firebase) and notesCache (Redux)
        await setDoc(doc(db, 'notes', noteIdEditNoteModal), { title: titleInputValue }, { merge: true });

        if (notesCache) {
          let notesCacheCopy = JSON.parse(JSON.stringify(notesCache));

          for (let i = 0; i < notesCacheCopy.length; i++) {
            if (notesCacheCopy[i].id === noteIdEditNoteModal) {
              notesCacheCopy[i].title = titleInputValue;
            }
          }

          dispatch(updateNotesCache(notesCacheCopy));
        }

        dispatch(setSnackbar('Note was renamed'));
      } catch (error) {
        dispatch(setSnackbar('Failed to rename the note'));
      }

      // STEP 4: Update title in activeNoteTitle (Redux) and titleDeleteValue
      dispatch(updateActiveNoteTitle(titleInputValue));
      setInitialTitleInputValue(titleInputValue);
      setTitleDeleteValue(titleInputValue);
    }
  };

  const handleDeleteNote = async () => {
    // STEP 1: Check if titleDeleteValue === titleDeleteInputValue
    if (titleDeleteValue !== titleDeleteInputValue) return;

    try {
      // STEP 2: Delete Note from user.documents (Firebase and Redux)
      dispatch(deleteFromDocuments({ type: 'notes', id: noteIdEditNoteModal }));

      // STEP 3: Delete Note from notes (Firebase) and notesCache (Redux)
      await deleteDoc(doc(db, 'notes', noteIdEditNoteModal));

      if (notesCache) {
        let notesCacheCopy = JSON.parse(JSON.stringify(notesCache));

        if (notesCacheCopy && notesCacheCopy.length > 0) {
          let filteredNotesCacheCopy = notesCacheCopy.filter(i => i.id !== noteIdEditNoteModal);
          dispatch(updateNotesCache(filteredNotesCacheCopy));
        }
      }

      dispatch(setSnackbar('Note was deleted'));
    } catch (error) {
      dispatch(setSnackbar('Faild to delete the note'));
    }

    // STEP 4: Reset activeNote... (Redux) and inputs
    if (activeNoteId === noteIdEditNoteModal) {
      dispatch(setActiveNote({
        isNew: null,
        id: null,
        title: null,
        content: null,
      }));
    }

    setTitleInputValue('');
    setTitleDeleteValue('');
    setTitleDeleteInputValue('');

    // STEP 5: Close modal
    handleCloseEditNote();
  };

  return (
    <div id="note" className={css.container}>
      {notes?.map((i, index) => (
        <DragAdnDropElement key={index} index={index} id={i.id} type="note" name={i.title} openSettingsModal={handleOpenEditNoteModal}>
          <div className={`${css.note} ${activeNoteId === i.id && css.active}`} onClick={() => handleOpenNote(i.id)} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
            <span className={css.icon}>
              <IconButton path={DOC} variant="secondary" />
            </span>
            <span className={css.noteTitle}>{i.title}</span>
            <span className={css.iconMore}>
              <Tooltip content="Settings" preferablePosition="bottom">
                <IconButton path={MORE_VERTICAL} variant="secondary" onClick={handleOpenEditNoteModal} />
              </Tooltip>
            </span>
          </div>
        </DragAdnDropElement>
      ))}
      <Modal open={editNoteModal} close={handleCloseEditNote}>
        <div className={css.eiditNoteModalContent}>
          <Input id="noteTitleId" label="Edit note title" placeholder="Enter note name" value={titleInputValue} onChange={e => setTitleInputValue(e.target.value)} onEnter={handleEditNoteTitle} />
          <Button variant="outlined" disabled={!titleInputValue || titleInputValue === initialTitleInputValue} onClick={handleEditNoteTitle}>Rename note</Button>
          <Input id="noteDeleteTitleId" label={`Enter ${titleDeleteValue} to delete the note`} placeholder="Enter note name" value={titleDeleteInputValue} onChange={e => setTitleDeleteInputValue(e.target.value)} />
          <Button variant="outlined" disabled={titleDeleteValue !== titleDeleteInputValue} onClick={handleDeleteNote}>Delete note</Button>
        </div>
      </Modal>
    </div>
  );
};
