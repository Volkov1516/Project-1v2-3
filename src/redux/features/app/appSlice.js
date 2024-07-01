import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  windowWidth: null,
  theme: null,
  path: ['root'],
  snackbar: null,
  modalGlobalSettings: false,
  addFolderModal: false,
  modalFolderSettings: false,
  noteModal: false,
  editNoteModal: false,
  lockEditor: false
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
    setModalGlobalSettings: (state, action) => {
      state.modalGlobalSettings = action.payload;
    },
    setAddFolderModal: (state, action) => {
      state.addFolderModal = action.payload;
    },
    setModalFolderSettings: (state, action) => {
      state.modalFolderSettings = action.payload;
    },
    setNoteModal: (state, action) => {
      state.noteModal = action.payload;
    },
    setEditNoteModal: (state, action) => {
      state.editNoteModal = action.payload;
    },
    setLockEditor: (state, action) => {
      state.lockEditor = action.payload;
    },
    resetAppState: () => initialState,
  }
});

export const {
  setWindowWidth,
  setTheme,
  setPath,
  setSnackbar,
  setModalGlobalSettings,
  setAddFolderModal,
  setNoteModal,
  setModalFolderSettings,
  setEditNoteModal,
  setLockEditor,
  resetAppState
} = appSlice.actions;
export default appSlice.reducer;
