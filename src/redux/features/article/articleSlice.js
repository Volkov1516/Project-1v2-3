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
    updateDocumentCategory: (state, action) => {
      state.documentCategories = action.payload;
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
  }
});

export const {
  setDocuments,
  setFilteredDocumentsId,
  setIsNewDocument,
  setCurrentDocument,
  createDocument,
  deleteDocument,
  updateDocumentTitle,
  updateDocumentContent,
  updateDocumentColor,
  updateDocumentCategory,
  updateDocumentArchive,
  updateDocuments,
  updateDocumentIndex,
} = articleSlice.actions;
export default articleSlice.reducer;
