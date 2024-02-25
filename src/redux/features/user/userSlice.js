import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userId: null,
  email: null,
  documents: null,
  path: ['root']
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.userId = action.payload?.id;
      state.email = action.payload?.email;
      state.documents = action.payload?.documents;
    },
    updateDocuments: (state, action) => {
      state.documents = action.payload;
    },
    updatePath: (state, action) => {
      state.path = action.payload;
    }
  }
});

export const { setUser, updateDocuments, updatePath } = userSlice.actions;
export default userSlice.reducer;
