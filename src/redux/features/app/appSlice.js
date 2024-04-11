import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: null,
  snackbar: null,
  navigationPath: null
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
    setNavigationPath: (state, action) => {
      state.navigationPath = action.payload;
    }
  }
});

export const { setTheme, setSnackbar, setNavigationPath } = appSlice.actions;
export default appSlice.reducer;
