import { configureStore } from '@reduxjs/toolkit';

import appReducer from './features/app/appSlice';
import userReducer from './features/user/userSlice';
import noteReducer from './features/note/noteSlice';

export const store = configureStore({
  reducer: {
    app: appReducer,
    user: userReducer,
    note: noteReducer,
  },
});
