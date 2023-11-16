import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  tags: []
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setTags: (state, action) => {
      state.tags = action.payload;
    },
    addTag: (state, action) => {
      state.tags.push(action.payload);
    },
    updateTag: (state, action) => {
      state.tags = action.payload;
    },
    deleteTag: (state, action) => {
      let newTags = state.tags.filter(i => i.id !== action.payload);
      state.tags = newTags;
    },
  }
});

export const { setUser, setTags, addTag, updateTag, deleteTag } = userSlice.actions;
export default userSlice.reducer;
