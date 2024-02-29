import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  snackbar: null
};

export const appSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setSnackbar: (state, action) => {
      state.snackbar = action.payload;
    }
  }
});

export const { setSnackbar } = appSlice.actions;
export default appSlice.reducer;
