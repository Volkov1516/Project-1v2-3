import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  windowWidth: null,
  theme: null,
  path: ['root'],
  snackbar: null,
  settingsModal: false,
  addFolderModal: false,
  editFolderModal: false,
  noteModal: false,
  editNoteModal: false,
};

export const appSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setWindowWidth: (state, action) => {
      state.windowWidth = action.payload;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setPath: (state, action) => {
      state.path = action.payload;
    },
    setSnackbar: (state, action) => {
      state.snackbar = action.payload;
    },
    setSettingsModal: (state, action) => {
      state.settingsModal = action.payload;
    },
    setAddFolderModal: (state, action) => {
      state.addFolderModal = action.payload;
    },
    setEditFolderModal: (state, action) => {
      state.editFolderModal = action.payload;
    },
    setNoteModal: (state, action) => {
      state.noteModal = action.payload;
    },
    setEditNoteModal: (state, action) => {
      state.editNoteModal = action.payload;
    },
  }
});

export const {
  setWindowWidth,
  setTheme,
  setPath,
  setSnackbar,
  setSettingsModal,
  setAddFolderModal,
  setNoteModal,
  setEditFolderModal,
  setEditNoteModal
} = appSlice.actions;
export default appSlice.reducer;
