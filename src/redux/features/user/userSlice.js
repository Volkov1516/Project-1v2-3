import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit';
import { resetAppState } from '../app/appSlice';
import { resetNoteState } from '../note/noteSlice';
import { auth, storage } from 'services/firebase.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  updateProfile
} from 'firebase/auth';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';

import { normalizeAuthErrorMessage } from 'utils/normalizeAuthErrorMessage';

const initialState = {
  userId: null,
  userEmail: null,
  userName: null,
  userPhoto: null,
  loadingFetchUser: true,
  errorFetchUser: false,
  loadingAuthForm: false,
  errorAuthForm: false,
  loadingUpdateUser: false,
  errorUpdateUser: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUserName: (state, action) => {
      state.userName = action.payload;
    },
    updateUserPhoto: (state, action) => {
      state.userPhoto = action.payload;
    },
    setLoadingFetchUser: (state, action) => {
      state.loadingFetchUser = action.payload;
    },
    resetUserState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserThunk.pending, (state) => {
        state.loadingFetchUser = true;
      })
      .addCase(fetchUserThunk.fulfilled, (state, action) => {
        state.userId = action.payload?.uid;
        state.userEmail = action.payload?.email;
        state.userName = action.payload?.displayName;
        state.userPhoto = action.payload?.photoURL;
        state.loadingFetchUser = false;
      })
      .addCase(fetchUserThunk.rejected, (state, action) => {
        state.errorFetchUser = action.error;
        state.loadingFetchUser = false;
      })
      .addCase(updateUserPhotoThunk.pending, (state) => {
        state.loadingUpdateUser = true;
      })
      .addCase(updateUserPhotoThunk.fulfilled, (state, action) => {
        state.userPhoto = action.payload;
        state.loadingUpdateUser = false;
      })
      .addCase(updateUserPhotoThunk.rejected, (state, action) => {
        state.errorUpdateUser = action.error;
        state.loadingUpdateUser = false;
      })
      .addCase(updateUserNameThunk.pending, (state) => {
        state.loadingUpdateUser = true;
      })
      .addCase(updateUserNameThunk.fulfilled, (state, action) => {
        state.userName = action.payload;
        state.loadingUpdateUser = false;
      })
      .addCase(updateUserNameThunk.rejected, (state, action) => {
        state.errorUpdateUser = action.error;
        state.loadingUpdateUser = false;
      })
      .addMatcher(isAnyOf(
        createUserWithEmailAndPasswordThunk.pending,
        signInWithEmailAndPasswordThunk.pending,
        signInWithGoogleThunk.pending,
        sendPasswordResetEmailThunk.pending,
        signOutThunk.pending
      ), (state) => {
        state.loadingAuthForm = true;
      })
      .addMatcher(isAnyOf(
        createUserWithEmailAndPasswordThunk.fulfilled,
        signInWithEmailAndPasswordThunk.fulfilled,
        signInWithGoogleThunk.fulfilled,
        sendPasswordResetEmailThunk.fulfilled,
        signOutThunk.fulfilled
      ), (state) => {
        state.loadingAuthForm = false;
      })
      .addMatcher(isAnyOf(
        createUserWithEmailAndPasswordThunk.rejected,
        signInWithEmailAndPasswordThunk.rejected,
        signInWithGoogleThunk.rejected,
        sendPasswordResetEmailThunk.rejected,
        signOutThunk.rejected
      ), (state, action) => {
        state.errorAuthForm = action.payload;
        state.loadingAuthForm = false;
      })
  }
});

export const fetchUserThunk = createAsyncThunk('user/fetchUserThunk', async ({ uid, email, displayName, photoURL }, thunkAPI) => {
  try {
    // This Thunk exists for the purpose of scaling the application.
    // It should fetch user when there will be some data.

    return {
      uid,
      email,
      displayName,
      photoURL
    };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const createUserWithEmailAndPasswordThunk = createAsyncThunk('user/createUserWithEmailAndPasswordThunk', async ({ email, password }, thunkAPI) => {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(auth.currentUser);
  } catch (error) {
    const message = normalizeAuthErrorMessage(error);
    return thunkAPI.rejectWithValue(message);
  }
});

export const signInWithEmailAndPasswordThunk = createAsyncThunk('user/signInWithEmailAndPasswordThunk', async ({ email, password }, thunkAPI) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    const message = normalizeAuthErrorMessage(error);
    return thunkAPI.rejectWithValue(message);
  }
});

export const signInWithGoogleThunk = createAsyncThunk('user/signInWithGoogleThunk', async (_, thunkAPI) => {
  try {
    const provider = new GoogleAuthProvider();

    await signInWithPopup(auth, provider);
  } catch (error) {
    const message = normalizeAuthErrorMessage(error);
    return thunkAPI.rejectWithValue(message);
  }
});

export const sendPasswordResetEmailThunk = createAsyncThunk('user/sendPasswordResetEmailThunk', async ({ email }, thunkAPI) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    const message = normalizeAuthErrorMessage(error);
    return thunkAPI.rejectWithValue(message);
  }
});

export const signOutThunk = createAsyncThunk('user/signOutThunk', async (_, thunkAPI) => {
  try {
    thunkAPI.dispatch(resetAppState());
    thunkAPI.dispatch(resetUserState());
    thunkAPI.dispatch(resetNoteState());

    await signOut(auth);

    localStorage.removeItem('theme');
    window.history.replaceState(null, '', '/');
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const updateUserPhotoThunk = createAsyncThunk('user/updateUserPhotoThunk', async ({ id, file }, thunkAPI) => {
  try {
    const storageRef = ref(storage, `images/avatars/${id}`);
    await uploadBytes(storageRef, file);

    const downloadURL = await getDownloadURL(storageRef);
    await updateProfile(auth.currentUser, { photoURL: downloadURL });

    return downloadURL;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const updateUserNameThunk = createAsyncThunk('user/updateUserNameThunk', async ({ displayName }, thunkAPI) => {
  try {
    await updateProfile(auth.currentUser, { displayName });

    return displayName;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const {
  updateUserName,
  updateUserPhoto,
  setLoadingFetchUser,
  resetUserState
} = userSlice.actions;
export default userSlice.reducer;
