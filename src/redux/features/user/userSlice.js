import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userId: null,
  userEmail: null,
  userName: null,
  userPhoto: null,
  documents: null,
  path: ['root'],
  activeTaskId: null
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.userId = action.payload?.id;
      state.userEmail = action.payload?.email;
      state.userName = action.payload?.name;
      state.userPhoto = action.payload?.photo;
      state.documents = action.payload?.documents;
    },
    updateUserName: (state, action) => {
      state.userName = action.payload;
    },
    updateUserPhoto: (state, action) => {
      state.userPhoto = action.payload;
    },
    updateDocuments: (state, action) => {
      state.documents = action.payload;
    },
    updatePath: (state, action) => {
      state.path = action.payload;
    },
    setActiveTaskId: (state, action) => {
      state.activeTaskId = action.payload;
    },
  }
});

export const { setUser, updateUserName, updateUserPhoto, updateDocuments, updatePath, setActiveTaskId } = userSlice.actions;
export default userSlice.reducer;
