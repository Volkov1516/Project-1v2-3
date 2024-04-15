import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: null,
  snackbar: null,
  appPathname: null,
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
    },
    setAppPathname: (state, action) => {
      state.appPathname = action.payload;
    }
  }
});

export const { setTheme, setSnackbar, setAppPathname } = appSlice.actions;
export default appSlice.reducer;
