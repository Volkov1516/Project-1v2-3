import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  windowWidth: null,
  theme: null,
  snackbar: null,
  modalGlobalSettings: false,
  addFolderModal: false,
  modalFolderSettings: false,
  noteModal: false,
  editNoteModal: false,
  lockEditor: false,
  isModalOpenResetPassword: false,
  isModalOpenVerficationEmail: false
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setWindowWidth: (state, action) => {
      state.windowWidth = action.payload;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
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
    setIsModalOpenPasswordReset: (state, action) => {
      state.isModalOpenResetPassword = action.payload;
    },
    setIsModalOpenVerificationEmail: (state, action) => {
      state.isModalOpenVerficationEmail = action.payload;
    },
    resetAppState: () => initialState,
  }
});

export const {
  setWindowWidth,
  setTheme,
  setSnackbar,
  setModalGlobalSettings,
  setAddFolderModal,
  setNoteModal,
  setModalFolderSettings,
  setEditNoteModal,
  setLockEditor,
  setIsModalOpenPasswordReset,
  setIsModalOpenVerificationEmail,
  resetAppState,
} = appSlice.actions;
export default appSlice.reducer;
