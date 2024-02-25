import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notesCache: null,
  activeNoteId: null,
  activeNoteMode: null
};

export const noteSlice = createSlice({
  name: 'note',
  initialState,
  reducers: {
    updateNotesCache: (state, action) => {
      state.notesCache = action.payload;
    },
    updateActiveNoteId: (state, action) => {
      state.activeNoteId = action.payload;
    }
  }
});

export const { updateNotesCache, updateActiveNoteId } = noteSlice.actions;
export default noteSlice.reducer;
