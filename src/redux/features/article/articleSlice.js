import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  documents: [],
  filteredDocumentsId: [],
  isNewDocument: false,
  documentIndex: null,
  documentId: null,
  title: null,
  content: null,
  color: null,
  documentCategories: [],
  archive: null,
  date: null,
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
    setCurrentDocument: (state, action) => {
      state.isNewDocument = action.payload?.isNew;
      state.documentIndex = action.payload?.index;
      state.documentId = action.payload?.id;
      state.title = action.payload?.title;
      state.content = action.payload?.content;
      state.color = action.payload?.color;
      state.documentCategories = action.payload?.categories;
      state.archive = action.payload?.archive;
    },
    createDocument: (state, action) => {
      state.documents.unshift(action.payload);
      state.filteredDocumentsId.unshift(action.payload.id);
    },
    deleteDocument: (state, action) => {
      let newDocuments = state.documents.filter(i => i?.id !== action.payload.id);
      state.documents = newDocuments;

      let newFiltered = state.filteredDocumentsId.filter(i => i !== action.payload.id);
      state.filteredDocumentsId = newFiltered;
    },
    updateDocuments: (state, action) => {
      let newDocuments = state.documents.map(i => {
        if (i.id === action.payload.id) {
          return ({ ...i, [action.payload.key]: action.payload.value });
        } else {
          return i;
        }
      });

      console.log(JSON.parse(JSON.stringify(newDocuments)));
      state.documents = JSON.parse(JSON.stringify(newDocuments));
    },
    updateDocumentTitle: (state, action) => {
      state.title = action.payload;
    },



    updateDocumentIndex: (state, action) => {
      const currentDocumentId = state.filteredDocumentsId[action.payload];
      const currentDocument = state.documents?.find(i => i.id === currentDocumentId);

      state.documentIndex = action.payload;
      state.documentId = currentDocument?.id;
      state.title = currentDocument?.title || 'Untitled';
      state.content = currentDocument?.content;
      state.color = currentDocument?.color;
      state.documentCategories = currentDocument?.categories;
      state.date = currentDocument?.date;
      state.archive = currentDocument?.archive;
      state.archive = currentDocument?.archive;
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
            categories: state?.documentCategories ? [...state.documentCategories, { id: action.payload.categoryId, name: action.payload.categoryName }] : [{ id: action.payload.categoryId, name: action.payload.categoryName }],
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

      if (state.documentCategories) {
        state.documentCategories.push({ id: action.payload.categoryId, name: action.payload.categoryName })
      }
      else {
        state.documentCategories = [{ id: action.payload.categoryId, name: action.payload.categoryName }];
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
      state.documentCategories = state.documentCategories?.filter(i => i.id !== action.payload.categoryId);
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
      state.archive = !state.archive;
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
    },
  }
});

export const {
  setDocuments,
  setFilteredDocumentsId,
  setIsNewDocument,
  setCurrentDocument,
  createDocument,
  deleteDocument,
  updateDocuments,
  updateDocumentTitle,
  updateDocumentIndex,

  updateArticle,
  updateColor,
  addArticleCategories,
  removeCategory,
  setArticleArchive,
} = articleSlice.actions;
export default articleSlice.reducer;
