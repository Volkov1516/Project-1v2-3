import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateNotesCache, updateActiveNoteId } from 'redux/features/note/noteSlice';
import { setCurrentDocument } from 'redux/features/document/documentSlice';
import { setEditorModalStatus } from 'redux/features/modal/modalSlice';
import { db } from 'firebase.js';
import { doc, getDoc } from 'firebase/firestore';

import { IconButton } from 'components/atoms/IconButton/IconButton';
import { Input } from 'components/atoms/Input/Input';
import { Button } from 'components/atoms/Button/Button';
import { Modal } from 'components/atoms/Modal/Modal';

import css from './Notes.module.css';

export const Notes = ({ notes }) => {
  const dispatch = useDispatch();

  const { notesCache, activeNoteId } = useSelector(state => state.note);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [titleInputValue, setTitleInput] = useState('');
  const [titleInputValueDelete, setTitleInputDelete] = useState('');

  const handleTouchStart = (e) => {
    const element = e.currentTarget;
    element.classList.add(css.touch);
  };

  const handleTouchEnd = (e) => {
    const element = e.currentTarget;
    element.classList.remove(css.touch);
  }

  const handleOpenEditNoteModal = (e, id, title) => {
    setTitleInput(title);
    setOpen(true);
  };

  const handleEditTitle = () => {
    setLoading(false);
  };

  const handleDeleteNote = () => { };

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
    dispatch(updateActiveNoteId(id));
    dispatch(setCurrentDocument({
      isNew: false,
      id: targetNote?.id,
      title: targetNote?.title,
      content: targetNote?.content,
    }));
    dispatch(setEditorModalStatus('editorModalFromComponent'));
    window.history.pushState({ modal: 'editorModalFromComponent' }, '', '#editor');
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
        loading={loading}
        open={open}
        setOpen={setOpen}
      >
        <div className={css.eiditNoteModalContent}>
          <Input label="Edit note title" placeholder="Enter folder name" value={titleInputValue} onChange={e => setTitleInput(e.target.value)} />
          <Button text="Rename folder" disabled={!titleInputValue} onClick={handleEditTitle} />
          <Input label={`Enter ${titleInputValue} to delete the note`} placeholder="Enter folder name" value={titleInputValueDelete} onChange={e => setTitleInputDelete(e.target.value)} />
          <Button text="Delete folder" disabled={!titleInputValueDelete} onClick={handleDeleteNote} />
        </div>
      </Modal>
    </div>
  );
};
