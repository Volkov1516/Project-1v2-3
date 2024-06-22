import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notesCache: null,
  isNewNote: null,
  activeNoteId: null,
  activeNoteTitle: null,
  activeNoteContent: null,
  canUndo: false,
  canRedo: false,
};

export const noteSlice = createSlice({
  name: 'note',
  initialState,
  reducers: {
    updateNotesCache: (state, action) => {
      state.notesCache = action.payload;
    },
    updateIsNewNote: (state, action) => {
      state.isNewNote = action.payload;
    },
    setActiveNote: (state, action) => {
      state.isNewNote = action.payload?.isNew;
      state.activeNoteId = action.payload?.id;
      state.activeNoteTitle = action.payload?.title;
      state.activeNoteContent = action.payload?.content;
    },
    updateActiveNoteTitle: (state, action) => {
      state.activeNoteTitle = action.payload;
    },
    setCanUndo: (state, action) => {
      state.canUndo = action.payload;
    },
    setCanRedo: (state, action) => {
      state.canRedo = action.payload;
    },
  }
});

export const { updateNotesCache, setActiveNote, updateActiveNoteTitle, updateIsNewNote, setCanUndo, setCanRedo } = noteSlice.actions;
export default noteSlice.reducer;
