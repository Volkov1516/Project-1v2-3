import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  all: [],
  current: null
};

export const articleSlice = createSlice({
  name: 'article',
  initialState,
  reducers: {
    SET_ALL: (state, action) => {
      state.all = action.payload;
    },
    SET_CURRENT: (state, action) => {
      state.current = action.payload;
    }
  }
});

export const { SET_ALL, SET_CURRENT } = articleSlice.actions;
export default articleSlice.reducer;

