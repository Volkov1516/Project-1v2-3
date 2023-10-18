import { createSlice } from '@reduxjs/toolkit';

const EMPTY_CONTENT = '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}';

const initialState = {
  all: [],
  currentId: null,
  currentIndex: null,
  content: EMPTY_CONTENT
};

export const articleSlice = createSlice({
  name: 'article',
  initialState,
  reducers: {
    SET_ALL: (state, action) => {
      state.all = action.payload;
    },
    SET_CURRENT_ID: (state, action) => {
      state.currentId = action.payload;
    },
    SET_CURRENT_INDEX: (state, action) => {
      state.currentIndex = action.payload;
    },
    INCREMENT_CURRENT_INDEX: (state) => {
      state.currentIndex += 1;
    },
    DECREMENT_CURRENT_INDEX: (state) => {
      state.currentIndex -= 1;
    },
    SET_CONTENT: (state, action) => {
      state.content = action.payload;
    }
  }
});

export const {
  SET_ALL,
  SET_CURRENT_ID,
  SET_CURRENT_INDEX,
  INCREMENT_CURRENT_INDEX,
  DECREMENT_CURRENT_INDEX,
  SET_CONTENT
} = articleSlice.actions;
export default articleSlice.reducer;
