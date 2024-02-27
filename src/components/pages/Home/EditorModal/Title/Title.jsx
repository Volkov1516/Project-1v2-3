import { useEffect, forwardRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateDocuments } from 'redux/features/user/userSlice';
import { updateNotesCache, updateIsNewNote, updateActiveNoteTitle } from 'redux/features/note/noteSlice';
import { db } from 'firebase.js';
import { doc, setDoc } from 'firebase/firestore';

import css from './Title.module.css';

export const Title = forwardRef(function MyTitle(props, ref) {
  const dispatch = useDispatch();

  const { userId, documents, path } = useSelector(state => state.user);
  const { notesCache, isNewNote, activeNoteMode, activeNoteId, activeNoteTitle } = useSelector(state => state.note);

  useEffect(() => {
    if (ref?.current) ref.current.style.height = ref.current.scrollHeight + 'px';
  }, [activeNoteTitle, ref]);

  const handleEnter = e => e.key === 'Enter' && e.preventDefault();

  const handleTitleChange = e => dispatch(updateActiveNoteTitle(e.target.value));

  const handleTitleBlur = async () => {
    const newNote = {
      id: activeNoteId,
      title: activeNoteTitle || 'Untitled',
    };

    // STEP 1: Create/Update title in user.documents (Firestore, Redux)
    const newDocuments = JSON.parse(JSON.stringify(documents));

    function findFolder(object, id, newObject) {
      if (object.id === id) {
        if (isNewNote) {
          object.notes.push(newObject);
        }
        else {
          for (let i = 0; i < object?.notes?.length; i++) {
            if (object.notes[i].id === activeNoteId) {
              object.notes[i].title = activeNoteTitle;
            }
          }
        }
      } else if (object.folders && object.folders.length > 0) {
        for (let i = 0; i < object.folders.length; i++) {
          findFolder(object.folders[i], id, newObject);
        }
      }
    }

    findFolder(newDocuments, path[path.length - 1], newNote);

    await setDoc(doc(db, 'users', userId), { documents: newDocuments }, { merge: true })
      .then(() => dispatch(updateDocuments(newDocuments)))
      .catch(err => console.log(err));

    // STEP 2: Update title in notes and notesCache
    await setDoc(doc(db, 'notes', activeNoteId), newNote, { merge: true })
      .then(() => {
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
      })
      .catch(error => console.log(error));

    dispatch(updateIsNewNote(false));
  }

  return (
    <div className={css.container}>
      <textarea
        ref={ref}
        className={css.textarea}
        placeholder="Untitled"
        rows={1}
        spellCheck={false}
        readOnly={activeNoteMode === "preview"}
        value={activeNoteMode === "preview" ? (activeNoteTitle || "Untitled") : activeNoteTitle}
        onKeyDown={handleEnter}
        onChange={handleTitleChange}
        onBlur={handleTitleBlur}
      />
    </div>
  );
});
