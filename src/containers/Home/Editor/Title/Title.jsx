import { useEffect, useState, forwardRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSnackbar } from 'redux/features/app/appSlice';
import { createInDocuments, updateInDocuments } from 'redux/features/user/userSlice';
import { updateNotesCache, updateIsNewNote, updateActiveNoteTitle } from 'redux/features/note/noteSlice';
import { db } from 'services/firebase.js';
import { doc, setDoc } from 'firebase/firestore';

import css from './Title.module.css';

export const Title = forwardRef(function MyTitle(props, ref) {
  const dispatch = useDispatch();

  const { notesCache, isNewNote, activeNoteId, activeNoteTitle } = useSelector(state => state.note);

  const [initialValue, setInitialValue] = useState(null);

  useEffect(() => {
    if (ref?.current) {
      ref.current.style.height = 'auto';
      ref.current.style.height = ref.current.scrollHeight + 'px';
    }
  }, [activeNoteTitle, ref]);

  const handleClick = e => setInitialValue(e.target.value);

  const handleEnter = e => e.key === 'Enter' && e.preventDefault();

  const handleTitleChange = e => dispatch(updateActiveNoteTitle(e.target.value));

  const handleTitleBlur = async () => {
    if (activeNoteTitle === initialValue) return;

    const newNote = {
      id: activeNoteId,
      title: activeNoteTitle || 'Untitled',
    };

    try {
      // STEP 1: Create/Update title in user.documents (Firestore, Redux)
      if (isNewNote) {
        dispatch(createInDocuments({ type: 'notes', obj: newNote }));
      }
      else {
        dispatch(updateInDocuments({ type: 'notes', id: activeNoteId, name: 'title', value: activeNoteTitle }));
      }

      // STEP 2: Update title in notes and notesCache
      await setDoc(doc(db, 'notes', activeNoteId), { title: activeNoteTitle || 'Untitled' }, { merge: true });

      if (notesCache) {
        let notesCacheCopy = JSON.parse(JSON.stringify(notesCache));

        for (let i = 0; i < notesCacheCopy.length; i++) {
          if (notesCacheCopy[i].id === activeNoteId) {
            notesCacheCopy[i].title = activeNoteTitle;
          }
        }

        dispatch(updateNotesCache(notesCacheCopy));
      }
      else {
        dispatch(updateNotesCache([newNote]));
      }

      dispatch(updateIsNewNote(false));
    } catch (error) {
      dispatch(setSnackbar('Faild to update note title'));
    }
  };

  return (
    <div className={css.container}>
      <textarea
        id="editorTitle"
        ref={ref}
        className={css.textarea}
        placeholder="Untitled"
        rows={1}
        spellCheck={false}
        value={activeNoteTitle}
        onClick={handleClick}
        onKeyDown={handleEnter}
        onChange={handleTitleChange}
        onBlur={handleTitleBlur}
      />
    </div>
  );
});
