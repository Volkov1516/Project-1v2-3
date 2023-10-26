import { createSlice } from '@reduxjs/toolkit';

const EMPTY_CONTENT = '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}';

const initialState = {
  originalArticles: [],
  filteredArticles: [],
  articleId: null,
  articleIndex: null,
  title: '',
  content: EMPTY_CONTENT,
  newArticle: false
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
    ADD_ARTICLE: (state, action) => {
      state.originalArticles.push(action.payload);
      state.filteredArticles.push(action.payload);
    },
    UPDATE_ARTICLE: (state, action) => {
      let newOriginal = state.originalArticles.map(i => {
        if (i.id === action.payload.id) {
          let newObj = {
            id: i?.id,
            title: action.payload.title,
            content: action.payload.content,
            categories: i?.categories,
            color: i?.color,
            date: i?.date,
            archive: i?.archive,
          }

          return newObj;
        }
        else {
          return i;
        }
      });

      state.originalArticles = JSON.parse(JSON.stringify(newOriginal));

      let newFiltered = state.filteredArticles.map(i => {
        if (i.id === action.payload.id) {
          let newObj = {
            id: i?.id,
            title: action.payload.title,
            content: action.payload.content,
            categories: i?.categories,
            color: i?.color,
            date: i?.date,
            archive: i?.archive,
          }

          return newObj;
        }
        else {
          return i;
        }
      });

      state.filteredArticles = JSON.parse(JSON.stringify(newFiltered));
    },
    SET_CURRENT_ID: (state, action) => {
      state.articleId = action.payload;
    },
    SET_CURRENT_INDEX: (state, action) => {
      state.articleIndex = action.payload;
    },
    INCREMENT_CURRENT_INDEX: (state) => {
      state.articleIndex += 1;
    },
    DECREMENT_CURRENT_INDEX: (state) => {
      state.articleIndex -= 1;
    },
    SET_TITLE: (state, action) => {
      state.title = action.payload;
    },
    SET_CONTENT: (state, action) => {
      state.content = action.payload;
    },
    SET_NEW_ARTICLE: (state, action) => {
      state.newArticle = action.payload;
    }
  }
});

export const {
  SET_ORIGINAL_ARTICLES,
  SET_FILTERED_ARTICLES,
  ADD_ARTICLE,
  UPDATE_ARTICLE,
  SET_CURRENT_ID,
  SET_CURRENT_INDEX,
  INCREMENT_CURRENT_INDEX,
  DECREMENT_CURRENT_INDEX,
  SET_TITLE,
  SET_CONTENT,
  SET_NEW_ARTICLE
} = articleSlice.actions;
export default articleSlice.reducer;
