import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateDocuments } from 'redux/features/user/userSlice';
import { updateNotesCache, setActiveNote, updateActiveNoteTitle } from 'redux/features/note/noteSlice';
import { db } from 'firebase.js';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';

import { IconButton } from 'components/atoms/IconButton/IconButton';
import { Input } from 'components/atoms/Input/Input';
import { Button } from 'components/atoms/Button/Button';
import { Modal } from 'components/atoms/Modal/Modal';

import css from './Notes.module.css';

export const Notes = ({ notes }) => {
  const dispatch = useDispatch();

  const { userId, documents, path } = useSelector(state => state.user);
  const { notesCache, activeNoteId } = useSelector(state => state.note);

  const [openEditNoteModal, setOpenEditNoteModal] = useState(false);
  const [loadingEditNoteModal, setLoadingEditNoteModal] = useState(false);
  const [noteIdEditNoteModal, setNoteIdEditNoteModal] = useState(null);
  const [titleInputValue, setTitleInputValue] = useState('');
  const [titleDeleteValue, setTitleDeleteValue] = useState('');
  const [titleDeleteInputValue, setTitleDeleteInputValue] = useState('');

  const handleTouchStart = (e) => {
    const element = e.currentTarget;
    element.classList.add(css.touch);
  };

  const handleTouchEnd = (e) => {
    const element = e.currentTarget;
    element.classList.remove(css.touch);
  };

  const handleOpenNote = async (id) => {
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
        console.log(error);
        return;
      }
    }

    // STEP 4: Open Editor with targetNote data
    dispatch(setActiveNote({
      isNew: false,
      mode: 'edit',
      id: targetNote?.id,
      title: targetNote?.title,
      content: targetNote?.content,
    }));
  };

  const handleOpenEditNoteModal = (e, id, title) => {
    e.stopPropagation();
    setNoteIdEditNoteModal(id);
    setTitleInputValue(title);
    setTitleDeleteValue(title);
    setOpenEditNoteModal(true);
  };

  const handleEditNoteTitle = async () => {
    // STEP 1: Return if no changes
    if (titleInputValue === titleDeleteValue) return;

    if (titleInputValue && titleInputValue.length > 0) {
      setLoadingEditNoteModal(true);

      // STEP 2: Update title in user.documents (Redux, Firebase)
      const documentsCopy = JSON.parse(JSON.stringify(documents));

      function updateNoteTitle(object, folderId, noteId, newTitle) {
        if (object.id === folderId) {
          if (object.notes && object.notes.length > 0) {
            for (let i = 0; i < object?.notes?.length; i++) {
              if (object.notes[i].id === noteId) {
                object.notes[i].title = newTitle;
              }
            }
          }
        }
        else if (object.folders && object.folders.length > 0) {
          for (let i = 0; i < object?.folders?.length; i++) {
            updateNoteTitle(object.folders[i], folderId, noteId, newTitle);
          }
        }
      }

      updateNoteTitle(documentsCopy, path[path.length - 1], noteIdEditNoteModal, titleInputValue);

      await setDoc(doc(db, 'users', userId), { documents: documentsCopy }, { merge: true })
        .then(() => {
          dispatch(updateDocuments(documentsCopy));
          setLoadingEditNoteModal(false);
        })
        .catch(err => {
          console.log(err);
          setLoadingEditNoteModal(false);
        });

      // STEP 3: Update title in notes (Firebase) and notesCache (Redux)
      await setDoc(doc(db, 'notes', noteIdEditNoteModal), { title: titleInputValue }, { merge: true })
        .then(() => {
          if (notesCache) {
            let notesCacheCopy = JSON.parse(JSON.stringify(notesCache));

            for (let i = 0; i < notesCacheCopy.length; i++) {
              if (notesCacheCopy[i].id === noteIdEditNoteModal) {
                notesCacheCopy[i].title = titleInputValue;
              }
            }

            dispatch(updateNotesCache(notesCacheCopy));
          }

          setLoadingEditNoteModal(false);
        })
        .catch(err => {
          console.log(err);
          setLoadingEditNoteModal(false);
        });

      // STEP 4: Update title in activeNoteTitle (Redux) and titleDeleteValue
      dispatch(updateActiveNoteTitle(titleInputValue));
      setTitleDeleteValue(titleInputValue);
    }
  };

  const handleDeleteNote = async () => {
    // STEP 1: Check if titleDeleteValue === titleDeleteInputValue
    if (titleDeleteValue !== titleDeleteInputValue) return;

    setLoadingEditNoteModal(true);

    // STEP 2: Delete Note from user.documents (Firebase and Redux)
    const documentsCopy = JSON.parse(JSON.stringify(documents));

    function deleteNote(object, folderId, noteId) {
      if (object.id === folderId) {
        if (object.notes && object.notes.length > 0) {
          for (let i = 0; i < object?.notes?.length; i++) {
            if (object.notes[i].id === noteId) {
              object.notes.splice(i, 1);
              return;
            }
          }
        }
      }
      else if (object.folders && object.folders.length > 0) {
        for (let i = 0; i < object?.folders?.length; i++) {
          deleteNote(object.folders[i], folderId, noteId);
        }
      }
    }

    deleteNote(documentsCopy, path[path.length - 1], noteIdEditNoteModal);

    await setDoc(doc(db, 'users', userId), { documents: documentsCopy }, { merge: true })
      .then(() => {
        dispatch(updateDocuments(documentsCopy));
        setLoadingEditNoteModal(false);
      })
      .catch(err => {
        console.log(err);
        setLoadingEditNoteModal(false);
      });

    // STEP 3: Delete Note from notes (Firebase) and notesCache (Redux)
    await deleteDoc(doc(db, 'notes', noteIdEditNoteModal))
      .then(() => {
        if (notesCache) {
          let notesCacheCopy = JSON.parse(JSON.stringify(notesCache));

          if (notesCacheCopy && notesCacheCopy.length > 0) {
            let filteredNotesCacheCopy = notesCacheCopy.filter(i => i.id !== noteIdEditNoteModal);
            dispatch(updateNotesCache(filteredNotesCacheCopy));
          }
        }

        setLoadingEditNoteModal(false);
      })
      .catch(err => {
        console.log(err);
        setLoadingEditNoteModal(false);
      });

    // STEP 4: Reset activeNote... (Redux) and inputs
    if (activeNoteId === noteIdEditNoteModal) {
      dispatch(setActiveNote({
        isNew: null,
        mode: null,
        id: null,
        title: null,
        content: null,
      }));
    }

    setTitleInputValue('');
    setTitleDeleteValue('');
    setTitleDeleteInputValue('');

    // STEP 5: Close modal
    setOpenEditNoteModal(false);
  };

  return (
    <div className={css.container}>
      {notes?.map((i) => (
        <div
          key={i.id}
          className={css.note}
          onClick={() => handleOpenNote(i.id)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {i.title}
          <span className={css.settings}>
            <IconButton onClick={(e) => handleOpenEditNoteModal(e, i.id, i.title)} small path="M480-218.461q-16.5 0-28.25-11.75T440-258.461q0-16.501 11.75-28.251t28.25-11.75q16.5 0 28.25 11.75T520-258.461q0 16.5-11.75 28.25T480-218.461ZM480-440q-16.5 0-28.25-11.75T440-480q0-16.5 11.75-28.25T480-520q16.5 0 28.25 11.75T520-480q0 16.5-11.75 28.25T480-440Zm0-221.538q-16.5 0-28.25-11.75T440-701.539q0-16.5 11.75-28.25t28.25-11.75q16.5 0 28.25 11.75t11.75 28.25q0 16.501-11.75 28.251T480-661.538Z" />
          </span>
        </div>
      ))}
      <Modal
        loading={loadingEditNoteModal}
        open={openEditNoteModal}
        setOpen={setOpenEditNoteModal}
      >
        <div className={css.eiditNoteModalContent}>
          <Input label="Edit note title" placeholder="Enter note name" value={titleInputValue} onChange={e => setTitleInputValue(e.target.value)} />
          <Button text="Rename note" disabled={!titleInputValue} onClick={handleEditNoteTitle} />
          <Input label={`Enter ${titleDeleteValue} to delete the note`} placeholder="Enter note name" value={titleDeleteInputValue} onChange={e => setTitleDeleteInputValue(e.target.value)} />
          <Button text="Delete note" disabled={titleDeleteValue !== titleDeleteInputValue} onClick={handleDeleteNote} />
        </div>
      </Modal>
    </div>
  );
};
