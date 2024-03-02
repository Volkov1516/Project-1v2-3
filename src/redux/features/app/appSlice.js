import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: null,
  snackbar: null
};

export const appSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setSnackbar: (state, action) => {
      state.snackbar = action.payload;
    }
  }
});

export const { setTheme, setSnackbar } = appSlice.actions;
export default appSlice.reducer;
