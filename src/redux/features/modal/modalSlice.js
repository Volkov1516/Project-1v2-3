import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  editorModalStatus: null,
  modalSettings: false,
  modalGlobalSettings: false,
  modalCategories: false,
  modalDeleteArticle: false,
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    setEditorModalStatus: (state, action) => {
      state.editorModalStatus = action.payload;
    },
    setModalSettings: (state, action) => {
      state.modalSettings = action.payload;
    },
    setModalGlobalSettings: (state, action) => {
      state.modalGlobalSettings = action.payload;
    },
    setModalCategories: (state, action) => {
      state.modalCategories = action.payload;
    },
    setModalDeleteArticle: (state, action) => {
      state.modalDeleteArticle = action.payload;
    }
  }
});

export const {
  setEditorModalStatus,
  setModalSettings,
  setModalGlobalSettings,
  setModalCategories,
  setModalDeleteArticle,
} = modalSlice.actions;
export default modalSlice.reducer;
