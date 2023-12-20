import { createSlice } from '@reduxjs/toolkit';

const EMPTY_CONTENT = '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}';

const initialState = {
  documents: [],
  filteredDocumentsId: [],
  isNewDocument: false,
  documentIndex: null,
  documentId: null,


  title: '',
  content: EMPTY_CONTENT,
  color: null,
  articleCategories: [],
  date: null,
  archive: null,
  isArchived: false,
};

export const articleSlice = createSlice({
  name: 'article',
  initialState,
  reducers: {
    setDocuments: (state, action) => {
      state.documents = action.payload;
    },
    setFilteredDocumentsId: (state, action) => {
      state.filteredDocumentsId = action.payload;
    },
    setIsNewDocument: (state, action) => {
      state.isNewDocument = action.payload;
    },
    setDocumentIndex: (state, action) => {
      state.documentIndex = action.payload;
    },
    setDocumentleId: (state, action) => {
      state.documentId = action.payload;
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
    setArticleCategories: (state, action) => {
      state.articleCategories = action.payload;
    },
    setIsArchived: (state, action) => {
      state.isArchived = action.payload;
    },


    updateColor: (state, action) => {
      let newArticles = state.documents.map(i => {
        if (i.id === action.payload.id) {
          let newObj = {
            id: i?.id,
            title: i?.title,
            content: i?.content,
            categories: i?.categories,
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

      state.documents = JSON.parse(JSON.stringify(newArticles));
      state.color = action.payload.color;
    },
    addArticleCategories: (state, action) => {
      let newArticles = state.documents.map(i => {
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

      state.documents = newArticles;

      if (state.articleCategories) {
        state.articleCategories.push({ id: action.payload.categoryId, name: action.payload.categoryName })
      }
      else {
        state.articleCategories = [{ id: action.payload.categoryId, name: action.payload.categoryName }];
      }
    },
    removeCategory: (state, action) => {
      let newArticles = state.documents.map(i => {
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

      state.documents = newArticles;
      state.articleCategories = state.articleCategories?.filter(i => i.id !== action.payload.categoryId);
    },
    setArticleArchive: (state, action) => {
      let newArticles = state.documents.map(i => {
        if (i.id === action.payload.id) {
          let newObj = {
            id: i?.id,
            title: i?.title,
            content: i?.content,
            categories: i?.categories,
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

      let newFilteredId = state.filteredDocumentsId.filter(i => i !== action.payload.id);

      state.documents = JSON.parse(JSON.stringify(newArticles));
      state.filteredDocumentsId = newFilteredId;
      state.isArchived = !state.isArchived;
    },
    addArticle: (state, action) => {
      state.documents.unshift(action.payload);
      state.filteredDocumentsId.unshift(action.payload.id);
    },
    updateArticle: (state, action) => {
      let newArticles = state.documents.map(i => {
        if (i.id === action.payload.id) {
          let newObj = {
            id: i?.id,
            title: action?.payload?.title ? action?.payload?.title : i?.title,
            content: action?.payload?.content ? action?.payload?.content : i?.content,
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

      state.documents = JSON.parse(JSON.stringify(newArticles));

      if (action?.payload?.title) {
        state.title = action?.payload?.title;
      }

      if (action?.payload?.content) {
        state.content = action?.payload?.content;
      }
      // state.title = action?.payload?.title;
      // state.content = action?.payload?.content;
    },
    deleteArticle: (state, action) => {
      let newArticles = state.documents.filter(i => i?.id !== action.payload.id);
      state.documents = newArticles;

      let newFiltered = state.filteredDocumentsId.filter(i => i !== action.payload.id);
      state.filteredDocumentsId = newFiltered;
    },



    updateDocumentIndex: (state, action) => {
      const currentDocumentId = state.filteredDocumentsId[action.payload];
      const currentDocument = state.documents?.find(i => i.id === currentDocumentId);

      state.documentIndex = action.payload;
      state.documentId = currentDocument?.id;
      state.title = currentDocument?.title || 'Untitled';
      state.content = currentDocument?.content;
      state.color = currentDocument?.color;
      state.articleCategories = currentDocument?.categories;
      state.date = currentDocument?.date;
      state.archive = currentDocument?.archive;
      state.isArchived = currentDocument?.archive;
    }
  }
});

export const {
  setDocuments,
  setFilteredDocumentsId,
  setIsNewDocument,
  setDocumentIndex,
  setDocumentleId,

  updateDocumentIndex,


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
  incrementIndex,
  decrementIndex,
} = articleSlice.actions;
export default articleSlice.reducer;
