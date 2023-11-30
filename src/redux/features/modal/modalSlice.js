import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  editorModalStatus: false,
  modalSettings: false,
  scrollOffset: 0,
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
    SET_MODAL_SCROLL: (state, action) => {
      state.scrollOffset = action.payload;
    },
  }
});

export const {
  setEditorModalStatus,
  setModalSettings,
  SET_MODAL_SCROLL,
} = modalSlice.actions;
export default modalSlice.reducer;
