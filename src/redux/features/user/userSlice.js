import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit';

import { db } from '../../../firebase.js';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import { findFolder } from 'utils/findFolder.js';
import { getNavigationPathId } from 'utils/getNavigationId.js';

const initialState = {
  userId: null,
  userEmail: null,
  userName: null,
  userPhoto: null,
  documents: null,
  activeTaskId: null,
  authLoading: true,
  documentsLoading: false,
  error: null
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
    setActiveTaskId: (state, action) => {
      state.activeTaskId = action.payload;
    },
    setLoading: (state, action) => {
      state.authLoading = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.authLoading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.userId = action.payload.id;
        state.userEmail = action.payload.email;
        state.userName = action.payload.name;
        state.userPhoto = action.payload.photo;
        state.documents = action.payload.documents;
        state.authLoading = false;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.error = action.error;
        state.authLoading = false;
      })
      .addMatcher(isAnyOf(createInDocuments.pending, updateInDocuments.pending, deleteFromDocuments.pending), (state) => {
        state.documentsLoading = true;
      })
      .addMatcher(isAnyOf(createInDocuments.fulfilled, updateInDocuments.fulfilled, deleteFromDocuments.fulfilled),
        (state, action) => {
          state.documents = action.payload;
          state.documentsLoading = false;
        }
      )
      .addMatcher(isAnyOf(createInDocuments.rejected, updateInDocuments.rejected, deleteFromDocuments.rejected),
        (state, action) => {
          state.error = action.error;
          state.documentsLoading = false;
        }
      )
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

export const createInDocuments = createAsyncThunk('user/createInDocuments', async (props, thunkAPI) => {
  const state = thunkAPI.getState();

  const { type, obj } = props;

  const navigationPathId = getNavigationPathId(state.app.navigationPath, 'folder');

  const newDocuments = JSON.parse(JSON.stringify(state.user.documents));

  const createObj = (targetFolder) => {
    if (type === 'tasks') {
      targetFolder[type].unshift(obj);
    }
    else {
      targetFolder[type].push(obj);
    }
  };

  findFolder(newDocuments, navigationPathId, createObj);

  try {
    if (type !== 'tasks') {
      await setDoc(doc(db, 'users', state.user.userId), { documents: newDocuments }, { merge: true });
    }

    return newDocuments;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const updateInDocuments = createAsyncThunk('user/updateInDocuments', async (props, thunkAPI) => {
  const state = thunkAPI.getState();

  const { type, id, name, value } = props;

  const navigationPathId = getNavigationPathId(state.app.navigationPath, 'folder');

  const newDocuments = JSON.parse(JSON.stringify(state.user.documents));

  const editObj = (targetFolder) => {
    if (targetFolder[type] && targetFolder[type].length > 0) {
      for (let i = 0; i < targetFolder[type].length; i++) {
        if (targetFolder[type][i].id === id) {
          targetFolder[type][i][name] = value;
        }
      }
    }
  };

  findFolder(newDocuments, navigationPathId, editObj);

  try {
    await setDoc(doc(db, 'users', state.user.userId), { documents: newDocuments }, { merge: true });

    return newDocuments;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const deleteFromDocuments = createAsyncThunk('user/deleteFromDocuments', async (props, thunkAPI) => {
  const state = thunkAPI.getState();
  const { type, id } = props;

  const navigationPathId = getNavigationPathId(state.app.navigationPath, 'folder');

  const newDocuments = JSON.parse(JSON.stringify(state.user.documents));

  const deleteObj = (targetFolder) => {
    if (targetFolder[type] && targetFolder[type].length > 0) {
      for (let i = 0; i < targetFolder[type].length; i++) {
        if (targetFolder[type][i].id === id) {
          targetFolder[type].splice(i, 1);
          return;
        }
      }
    }
  };

  findFolder(newDocuments, navigationPathId, deleteObj);

  try {
    await setDoc(doc(db, 'users', state.user.userId), { documents: newDocuments }, { merge: true });

    return newDocuments;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const {
  setUser,
  updateUserName,
  updateUserPhoto,
  updateDocuments,
  setActiveTaskId,
  setLoading
} = userSlice.actions;
export default userSlice.reducer;
