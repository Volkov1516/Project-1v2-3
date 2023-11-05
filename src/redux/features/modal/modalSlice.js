import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  modalEditorEmpty: false,
  modalEditorExisting: false,
  modalPreview: false,
  autofocus: false,
  scrollOffset: 0
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    SET_MODAL_EDITOR_EMPTY: (state, action) => {
      state.modalEditorEmpty = action.payload;
    },
    SET_MODAL_EDITOR_EXISTING: (state, action) => {
      state.modalEditorExisting = action.payload;
    },
    SET_MODAL_PREVIEW: (state, action) => {
      state.modalPreview = action.payload;
    },
    SET_MODAL_AUTOFOCUS: (state, action) => {
      state.autofocus = action.payload;
    },
    SET_MODAL_SCROLL: (state, action) => {
      state.scrollOffset = action.payload;
    },
  }
});

export const { SET_MODAL_EDITOR_EMPTY, SET_MODAL_EDITOR_EXISTING, SET_MODAL_PREVIEW, SET_MODAL_AUTOFOCUS, SET_MODAL_SCROLL } = modalSlice.actions;
export default modalSlice.reducer;
