import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSnackbar } from 'redux/features/app/appSlice';
import { updateInDocuments, deleteFromDocuments } from 'redux/features/user/userSlice';
import { updateNotesCache, setActiveNote, updateActiveNoteTitle } from 'redux/features/note/noteSlice';
import { db } from 'firebase.js';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';

import { IconButton } from 'components/atoms/IconButton/IconButton';
import { Input } from 'components/atoms/Input/Input';
import { Button } from 'components/atoms/Button/Button';
import { Modal } from 'components/atoms/Modal/Modal';

import css from './Notes.module.css';

import { Route } from 'components/atoms/Navigation/Route';
import { Link } from 'components/atoms/Navigation/Link';

export const Notes = ({ notes, preventOnClick, windowWidth, handleTouchStart, handleTouchEnd, handleTouchMove }) => {
  const dispatch = useDispatch();

  const { notesCache, activeNoteId } = useSelector(state => state.note);

  const [noteIdEditNoteModal, setNoteIdEditNoteModal] = useState(null);
  const [titleInputValue, setTitleInputValue] = useState('');
  const [titleDeleteValue, setTitleDeleteValue] = useState('');
  const [titleDeleteInputValue, setTitleDeleteInputValue] = useState('');

  const handleOpenNote = async (id) => {
    // Prevent onClick after mouseUp
    if (preventOnClick) return;

    // STEP 1: Return if this note is openned (need to clean up activeNoteId after close!)
    if (activeNoteId === id) return;

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
      isOpen: true,
      isNew: false,
      id: targetNote?.id,
      title: targetNote?.title,
      content: targetNote?.content,
    }));

    if (window.location.pathname === '/editor') return;

    window.history.pushState({}, '', 'editor');
    const navEvent = new PopStateEvent('popstate');
    window.dispatchEvent(navEvent);
  };

  const handleOpenEditNoteModal = (e, id, title) => {
    setNoteIdEditNoteModal(id);
    setTitleInputValue(title);
    setTitleDeleteValue(title);
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
        isOpen: null,
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
    window.history.back();
  };

  return (
    <div id="note" className={css.container}>
      {windowWidth < 639
        ? notes?.map((i, index) => (
          <div
            key={i.id}
            className={css.note}
            id={i.id}
            data-index={index}
            data-id={i.id}
            data-draggable={true}
            data-type="note"
            onClick={() => handleOpenNote(i.id)}
            onTouchStart={e => handleTouchStart(e, index, i.id, "note", i.title, handleOpenEditNoteModal)}
            onTouchEnd={e => handleTouchEnd(e)}
            onTouchMove={e => handleTouchMove(e, index, i.id, "note", i.title)}
          >
            {i.title}
            {/* <span className={css.settings}>
              <Link href="editNote">
                <IconButton onClick={(e) => handleOpenEditNoteModal(e, i.id, i.title)} small path="M480-218.461q-16.5 0-28.25-11.75T440-258.461q0-16.501 11.75-28.251t28.25-11.75q16.5 0 28.25 11.75T520-258.461q0 16.5-11.75 28.25T480-218.461ZM480-440q-16.5 0-28.25-11.75T440-480q0-16.5 11.75-28.25T480-520q16.5 0 28.25 11.75T520-480q0 16.5-11.75 28.25T480-440Zm0-221.538q-16.5 0-28.25-11.75T440-701.539q0-16.5 11.75-28.25t28.25-11.75q16.5 0 28.25 11.75t11.75 28.25q0 16.501-11.75 28.251T480-661.538Z" />
              </Link>
            </span> */}
          </div>
        ))
        : notes?.map((i, index) => (
          <div
            key={i.id}
            className={css.note}
            id={i.id}
            data-index={index}
            data-id={i.id}
            data-draggable={true}
            data-type="note"
            onClick={() => handleOpenNote(i.id)}
            onMouseDown={e => handleTouchStart(e, index, i.id, "note", i.title, handleOpenEditNoteModal)}
            onMouseUp={e => handleTouchEnd(e)}
            onMouseMove={e => handleTouchMove(e, index, i.id, "note", i.title)}
          >
            {i.title}
            <span className={css.settings}>
              <Link href="editNote">
                <IconButton onClick={(e) => handleOpenEditNoteModal(e, i.id, i.title)} small path="M480-218.461q-16.5 0-28.25-11.75T440-258.461q0-16.501 11.75-28.251t28.25-11.75q16.5 0 28.25 11.75T520-258.461q0 16.5-11.75 28.25T480-218.461ZM480-440q-16.5 0-28.25-11.75T440-480q0-16.5 11.75-28.25T480-520q16.5 0 28.25 11.75T520-480q0 16.5-11.75 28.25T480-440Zm0-221.538q-16.5 0-28.25-11.75T440-701.539q0-16.5 11.75-28.25t28.25-11.75q16.5 0 28.25 11.75t11.75 28.25q0 16.501-11.75 28.251T480-661.538Z" />
              </Link>
            </span>
          </div>
        ))
      }
      <Route path="/editNote">
        <Modal>
          <div className={css.eiditNoteModalContent}>
            <Input id="noteTitleId" label="Edit note title" placeholder="Enter note name" value={titleInputValue} onChange={e => setTitleInputValue(e.target.value)} />
            <Button type="outlined" disabled={!titleInputValue} onClick={handleEditNoteTitle}>Rename note</Button>
            <Input id="noteDeleteTitleId" label={`Enter ${titleDeleteValue} to delete the note`} placeholder="Enter note name" value={titleDeleteInputValue} onChange={e => setTitleDeleteInputValue(e.target.value)} />
            <Button type="outlined" disabled={titleDeleteValue !== titleDeleteInputValue} onClick={handleDeleteNote}>Delete note</Button>
          </div>
        </Modal>
      </Route>
    </div>
  );
};
