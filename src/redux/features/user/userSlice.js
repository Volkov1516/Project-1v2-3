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
    ADD_CATEGORY: (state, action) => {
      state.categories.push(action.payload);
    },
    DELETE_CATEGORY: (state, action) => {
      let newCategories = state.categories.filter(i => i.id !== action.payload);
      state.categories = newCategories;
    },
    UPDATE_CATEGORY: (state, action) => {
      state.categories = action.payload;
    },
  }
});

export const { SET_AUTH, SET_USER, SET_CATEGORIES, ADD_CATEGORY, DELETE_CATEGORY, UPDATE_CATEGORY } = userSlice.actions;
export default userSlice.reducer;
