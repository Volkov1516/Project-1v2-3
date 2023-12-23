import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  editorModalStatus: null,
  documentSettingsModal: false,
  documentDeleteModal: false,
  settingsModal: false,
  categoriesModal: false
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    setEditorModalStatus: (state, action) => {
      state.editorModalStatus = action.payload;
    },
    setDocumentSettingsModal: (state, action) => {
      state.documentSettingsModal = action.payload;
    },
    setDocumentDeleteModal: (state, action) => {
      state.documentDeleteModal = action.payload;
    },
    setCategoriesModal: (state, action) => {
      state.categoriesModal = action.payload;
    },
    setSettingsModal: (state, action) => {
      state.settingsModal = action.payload;
    },

  }
});

export const {
  setEditorModalStatus,
  setDocumentSettingsModal,
  setDocumentDeleteModal,
  setCategoriesModal,
  setSettingsModal
} = modalSlice.actions;
export default modalSlice.reducer;
