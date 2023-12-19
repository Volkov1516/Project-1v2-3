import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userId: null,
  email: null,
  userCategories: [],
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.userId = action.payload?.id;
      state.email = action.payload?.email;
      state.userCategories = action.payload?.categories;
    },
    addUserCategory: (state, action) => {
      if (state.userCategories) {
        state.userCategories.push(action.payload);
      }
      else {
        state.userCategories = [action.payload];
      }
    },
    updateUserCategory: (state, action) => {
      state.userCategories = action.payload;
    },
    deleteUserCategory: (state, action) => {
      let newCategories = state.userCategories.filter(i => i.id !== action.payload);
      state.userCategories = newCategories;
    }
  }
});

export const {
  setUser,
  addUserCategory,
  updateUserCategory,
  deleteUserCategory
} = userSlice.actions;
export default userSlice.reducer;
