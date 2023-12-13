import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  categories: [],
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    addCategory: (state, action) => {
      if (state.categories) {
        state.categories.push(action.payload);
      }
      else {
        state.categories = [action.payload];
      }
    },
    updateCategory: (state, action) => {
      state.categories = action.payload;
    },
    deleteCategory: (state, action) => {
      let newCategories = state.categories.filter(i => i.id !== action.payload);
      state.categories = newCategories;
    }
  }
});

export const {
  setUser,
  setCategories,
  addCategory,
  updateCategory,
  deleteCategory
} = userSlice.actions;
export default userSlice.reducer;
