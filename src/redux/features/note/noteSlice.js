import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notesCache: null,
  isNewNote: null,
  activeNoteMode: null,
  activeNoteId: null,
  activeNoteTitle: null,
  activeNoteContent: null,
};

export const noteSlice = createSlice({
  name: 'note',
  initialState,
  reducers: {
    updateNotesCache: (state, action) => {
      state.notesCache = action.payload;
    },
    setActiveNote: (state, action) => {
      state.isNewNote = action.payload?.isNew;
      state.activeNoteMode = action.payload?.mode;
      state.activeNoteId = action.payload?.id;
      state.activeNoteTitle = action.payload?.title;
      state.activeNoteContent = action.payload?.content;
    },
    updateActiveNoteTitle: (state, action) => {
      state.activeNoteTitle = action.payload;
    },
    updateActiveNoteMode: (state, action) => {
      state.activeNoteMode = action.payload;
    },
    updateIsNewNote: (state, action) => {
      state.isNewNote = action.payload;
    }
  }
});

export const { updateNotesCache, setActiveNote, updateActiveNoteTitle, updateActiveNoteMode, updateIsNewNote } = noteSlice.actions;
export default noteSlice.reducer;
