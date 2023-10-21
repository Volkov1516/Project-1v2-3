import { configureStore } from '@reduxjs/toolkit';

import userReducer from './features/user/userSlice';
import articleReducer from './features/article/articleSlice';
import modalReducer from './features/modal/modalSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    article: articleReducer,
    modal: modalReducer
  },
});
