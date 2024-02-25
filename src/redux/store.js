import { configureStore } from '@reduxjs/toolkit';

import userReducer from './features/user/userSlice';
import noteReducer from './features/note/noteSlice';
import documentReducer from './features/document/documentSlice';
import modalReducer from './features/modal/modalSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    note: noteReducer,
    document: documentReducer,
    modal: modalReducer
  },
});
