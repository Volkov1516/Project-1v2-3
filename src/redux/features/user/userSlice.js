import { createSlice, createAsyncThunk, nanoid } from '@reduxjs/toolkit';

import { db } from '../../../firebase.js';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import { findFolder } from 'utils/findFolder.js';

const initialState = {
  userId: null,
  userEmail: null,
  userName: null,
  userPhoto: null,
  documents: null,
  path: ['root'],
  activeTaskId: null,
  logged: false,
  loading: true,
  error: null,
  folderLoading: false
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
    setLogged: (state, action) => {
      state.logged = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.userId = action.payload.id;
        state.userEmail = action.payload.email;
        state.userName = action.payload.name;
        state.userPhoto = action.payload.photo;
        state.documents = action.payload.documents;
        state.logged = true;
        state.loading = false;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.error = action.error;
        state.loading = false;
      })
      .addCase(createFolder.pending, (state) => {
        state.folderLoading = true;
      })
      .addCase(createFolder.fulfilled, (state, action) => {
        state.documents = action.payload;
        state.folderLoading = false;
      })
      .addCase(createFolder.rejected, (state, action) => {
        state.error = action.error;
        state.loading = false;
      })
  }
});

export const fetchUser = createAsyncThunk('user/fetchUser', async (user) => {
  const docRef = doc(db, 'users', user?.uid);
  const docSnap = await getDoc(docRef);

  return {
    id: user?.uid,
    email: user?.email,
    name: docSnap?.data()?.name || user?.displayName || null,
    photo: docSnap?.data()?.photo || user?.photoURL || null,
    documents: docSnap?.data()?.documents || {
      id: 'root',
      folders: [],
      notes: [],
      tasks: []
    }
  };
});

export const createFolder = createAsyncThunk('user/createFolder', async (folderInputValue, thunkAPI) => {
  const state = thunkAPI.getState();

  const newDocuments = JSON.parse(JSON.stringify(state.user.documents));

    const createFolder = (targetFolder) => {
      const newFolder = {
        id: nanoid(),
        name: folderInputValue,
        folders: [],
        notes: [],
        tasks: []
      };

      targetFolder.folders.push(newFolder);
    };

    findFolder(newDocuments, state.user.path[state.user.path.length - 1], createFolder);

    await setDoc(doc(db, 'users', state.user.userId), { documents: newDocuments }, { merge: true });

    return newDocuments;
});

export const {
  setUser,
  updateUserName,
  updateUserPhoto,
  updateDocuments,
  updatePath,
  setActiveTaskId,
  setLogged,
  setLoading,
  setError
} = userSlice.actions;
export default userSlice.reducer;
