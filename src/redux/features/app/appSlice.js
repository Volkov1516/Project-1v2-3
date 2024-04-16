import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: null,
  snackbar: null,
  appPathname: null,
  navigationState: null,
  settingsModal: false
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
    },
    setNavigationState: (state, action) => {
      state.navigationState = action.payload;
    },
    setSettingsModal: (state, action) => {
      state.settingsModal = action.payload;
    }
  }
});

export const { setTheme, setSnackbar, setAppPathname, setNavigationState, setSettingsModal } = appSlice.actions;
export default appSlice.reducer;
