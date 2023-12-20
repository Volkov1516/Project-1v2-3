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

      state.documents = JSON.parse(JSON.stringify(newDocuments));
    },
    updateDocumentTitle: (state, action) => {
      state.title = action.payload;
    },
    updateDocumentContent: (state, action) => {
      state.content = action.payload;
    },
    updateDocumentColor: (state, action) => {
      state.color = action.payload;
    },
    updateDocumentArchive: (state, action) => {
      let newFilteredId = state.filteredDocumentsId.filter(i => i !== action.payload);

      state.filteredDocumentsId = newFilteredId;
      state.archive = !state.archive;
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
    }
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
  updateDocumentContent,
  updateDocumentColor,
  updateDocumentArchive,
  updateDocumentIndex,

  addArticleCategories,
  removeCategory,
} = articleSlice.actions;
export default articleSlice.reducer;
