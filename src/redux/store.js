import { configureStore } from '@reduxjs/toolkit';

import appReducer from './features/app/appSlice';
import userReducer from './features/user/userSlice';
import noteReducer from './features/note/noteSlice';
import documentReducer from './features/document/documentSlice';
import modalReducer from './features/modal/modalSlice';

export const store = configureStore({
  reducer: {
    app: appReducer,
    user: userReducer,
    note: noteReducer,
    document: documentReducer,
    modal: modalReducer
  },
});
