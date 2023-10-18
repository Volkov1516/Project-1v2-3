import { createSlice } from '@reduxjs/toolkit';

const EMPTY_CONTENT = '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}';

const initialState = {
  originalArticles: [],
  filteredArticles: [],
  currentId: null,
  currentIndex: null,
  title: '',
  content: EMPTY_CONTENT
};

export const articleSlice = createSlice({
  name: 'article',
  initialState,
  reducers: {
    SET_ORIGINAL_ARTICLES: (state, action) => {
      state.originalArticles = action.payload;
    },
    SET_FILTERED_ARTICLES: (state, action) => {
      state.filteredArticles = action.payload;
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
    SET_TITLE: (state, action) => {
      state.title = action.payload;
    },
    SET_CONTENT: (state, action) => {
      state.content = action.payload;
    }
  }
});

export const {
  SET_ORIGINAL_ARTICLES,
  SET_FILTERED_ARTICLES,
  SET_CURRENT_ID,
  SET_CURRENT_INDEX,
  INCREMENT_CURRENT_INDEX,
  DECREMENT_CURRENT_INDEX,
  SET_TITLE,
  SET_CONTENT
} = articleSlice.actions;
export default articleSlice.reducer;
