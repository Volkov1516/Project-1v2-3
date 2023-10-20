import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  logged: false,
  user: null,
  categories: []
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    SET_AUTH: (state, action) => {
      state.logged = action.payload;
    },
    SET_USER: (state, action) => {
      state.user = action.payload;
    },
    SET_CATEGORIES: (state, action) => {
      state.categories = action.payload;
    },
  }
});

export const { SET_AUTH, SET_USER, SET_CATEGORIES } = userSlice.actions;
export default userSlice.reducer;
