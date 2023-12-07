import { createSlice } from '@reduxjs/toolkit';

const EMPTY_CONTENT = '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}';

const initialState = {
  articles: [],
  filteredArticlesId: [],
  articleIndex: null,
  articleId: null,
  title: '',
  content: EMPTY_CONTENT,
  color: null,
  articleCategories: [],
  date: null,
  archive: null,
  isArchived: false,
  isNewArticle: false,
};

export const articleSlice = createSlice({
  name: 'article',
  initialState,
  reducers: {
    setArticles: (state, action) => {
      state.articles = action.payload;
    },
    setFilteredArticlesId: (state, action) => {
      state.filteredArticlesId = action.payload;
    },
    setArticleIndex: (state, action) => {
      state.articleIndex = action.payload;
    },
    setArticleId: (state, action) => {
      state.articleId = action.payload;
    },
    setArticleTitle: (state, action) => {
      state.title = action.payload;
    },
    setArticleContent: (state, action) => {
      state.content = action.payload;
    },
    setArticleColor: (state, action) => {
      state.color = action.payload;
    },
    updateColor: (state, action) => {
      let newArticles = state.articles.map(i => {
        if (i.id === action.payload.id) {
          let newObj = {
            id: i?.id,
            title: i?.title,
            content: i?.content,
            tags: i?.tags,
            color: action.payload.color,
            date: i?.date,
            archive: i?.archive,
          }

          return newObj;
        }
        else {
          return i;
        }
      });

      state.articles = JSON.parse(JSON.stringify(newArticles));
      state.color = action.payload.color;
    },
    setArticleCategories: (state, action) => {
      state.articleCategories = action.payload;
    },
    addArticleCategories: (state, action) => {
      let newArticles = state.articles.map(i => {
        if (i.id === action.payload.id) {
          let newObj = {
            id: i?.id,
            title: i?.title,
            content: i?.content,
            categories: state?.articleCategories ? [...state.articleCategories, { id: action.payload.categoryId, name: action.payload.categoryName }] : [{ id: action.payload.categoryId, name: action.payload.categoryName }],
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

      state.articles = newArticles;

      if (state.articleCategories) {
        state.articleCategories.push({ id: action.payload.categoryId, name: action.payload.categoryName })
      }
      else {
        state.articleCategories = [{ id: action.payload.categoryId, name: action.payload.categoryName }];
      }
    },
    removeCategory: (state, action) => {
      let newArticles = state.articles.map(i => {
        if (i.id === action.payload.id) {
          let newObj = {
            id: i?.id,
            title: i?.title,
            content: i?.content,
            categories: i?.categories?.filter(i => i.id !== action.payload.categoryId),
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

      state.articles = newArticles;
      state.articleCategories = state.articleCategories?.filter(i => i.id !== action.payload.categoryId);
    },
    setArticleArchive: (state, action) => {
      let newArticles = state.articles.map(i => {
        if (i.id === action.payload.id) {
          let newObj = {
            id: i?.id,
            title: i?.title,
            content: i?.content,
            tags: i?.tags,
            color: i?.color,
            date: i?.date,
            archive: action.payload.archive,
          }

          return newObj;
        }
        else {
          return i;
        }
      });

      let newFilteredId = state.filteredArticlesId.filter(i => i !== action.payload.id);

      state.articles = JSON.parse(JSON.stringify(newArticles));
      state.filteredArticlesId = newFilteredId;
      state.isArchived = !state.isArchived;
    },
    setIsArchived: (state, action) => {
      state.isArchived = action.payload;
    },
    addArticle: (state, action) => {
      state.articles.unshift(action.payload);
      state.filteredArticlesId.unshift(action.payload.id);
    },
    updateArticle: (state, action) => {
      let newArticles = state.articles.map(i => {
        if (i.id === action.payload.id) {
          let newObj = {
            id: i?.id,
            title: action.payload.title,
            content: action.payload.content,
            tags: i?.tags,
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

      state.articles = JSON.parse(JSON.stringify(newArticles));
      state.title = action.payload.title;
      state.content = action.payload.content;
    },
    deleteArticle: (state, action) => {
      let newArticles = state.articles.filter(i => i?.id !== action.payload.id);
      state.articles = newArticles;

      let newFiltered = state.filteredArticlesId.filter(i => i !== action.payload.id);
      state.filteredArticlesId = newFiltered;
    },
    setIsNewArticle: (state, action) => {
      state.isNewArticle = action.payload;
    },

    incrementIndex: (state) => {
      state.articleIndex += 1;
      const currentID = state.filteredArticlesId[state.articleIndex];
      const currentArticle = state.articles?.find(i => i.id === currentID);

      state.articleId = currentArticle?.id;
      state.title = currentArticle?.title || 'Untitled';
      state.content = currentArticle?.content;
      state.color = currentArticle?.color;
      state.articleCategories = currentArticle?.categories;
      state.date = currentArticle?.date;
      state.archive = currentArticle?.archive;
      state.isArchived = currentArticle?.archive;
    },
    decrementIndex: (state) => {
      state.articleIndex -= 1;

      const currentID = state.filteredArticlesId[state.articleIndex];
      const currentArticle = state.articles?.find(i => i.id === currentID);

      state.articleId = currentArticle?.id;
      state.title = currentArticle?.title || 'Untitled';
      state.content = currentArticle?.content;
      state.color = currentArticle?.color;
      state.articleCategories = currentArticle?.categories;
      state.date = currentArticle?.date;
      state.archive = currentArticle?.archive;
      state.isArchived = currentArticle?.archive;
    }
  }
});

export const {
  setArticles,
  setFilteredArticlesId,
  setArticleIndex,
  setArticleId,
  setArticleTitle,
  setArticleContent,
  setArticleColor,
  updateColor,
  setArticleCategories,
  addArticleCategories,
  removeCategory,
  setArticleArchive,
  setIsArchived,
  addArticle,
  updateArticle,
  deleteArticle,
  setIsNewArticle,
  incrementIndex,
  decrementIndex,
} = articleSlice.actions;
export default articleSlice.reducer;
