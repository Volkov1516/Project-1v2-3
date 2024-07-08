import { configureStore } from '@reduxjs/toolkit';

import appReducer from './features/app/appSlice';
import userReducer from './features/user/userSlice';
import treeReducer from './features/tree/treeSlice';
import noteReducer from './features/note/noteSlice';

export const store = configureStore({
  reducer: {
    app: appReducer,
    user: userReducer,
    tree: treeReducer,
    note: noteReducer,
  },
});
