import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit';
import { resetAppState } from '../app/appSlice';
import { resetNoteState } from '../note/noteSlice';
import { auth, db, storage } from 'services/firebase.js';
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
import { doc, setDoc } from 'firebase/firestore';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';

import { normalizeAuthErrorMessage } from 'utils/normalizeAuthErrorMessage';
import { findFolder } from 'utils/searchInManager.js';

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


  documents: null,
  activeTaskId: null,
  documentsLoading: false,
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
    setActiveTaskId: (state, action) => {
      state.activeTaskId = action.payload;
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
      .addMatcher(isAnyOf(
        createInDocuments.pending,
        updateInDocuments.pending,
        deleteFromDocuments.pending,
        updateTaskStatus.pending,
        dndSwap.pending,
        dndInside.pending,
        dndOutside.pending,
      ), (state) => {
        state.documentsLoading = true;
      })
      .addMatcher(isAnyOf(
        createInDocuments.fulfilled,
        updateInDocuments.fulfilled,
        deleteFromDocuments.fulfilled,
        updateTaskStatus.fulfilled,
        dndSwap.fulfilled,
        dndInside.fulfilled,
        dndOutside.fulfilled,
      ), (state, action) => {
        state.documents = action.payload;
        state.documentsLoading = false;
      }
      )
      .addMatcher(isAnyOf(
        createInDocuments.rejected,
        updateInDocuments.rejected,
        deleteFromDocuments.rejected,
        updateTaskStatus.rejected,
        dndSwap.rejected,
        dndInside.rejected,
        dndOutside.rejected,
      ), (state, action) => {
        state.documentsLoading = false;
      }
      )
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





export const createInDocuments = createAsyncThunk('user/createInDocuments', async (props, thunkAPI) => {
  const state = thunkAPI.getState();

  const { type, obj } = props;

  const newDocuments = JSON.parse(JSON.stringify(state.user.documents));

  const createObj = (targetFolder) => {
    if (type === 'tasks') {
      targetFolder[type].unshift(obj);
    }
    else {
      targetFolder[type].push(obj);
    }
  };

  findFolder(newDocuments, state.app.path[state.app.path.length - 1], createObj);

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

  findFolder(newDocuments, state.app.path[state.app.path.length - 1], editObj);

  try {
    await setDoc(doc(db, 'users', state.user.userId), { documents: newDocuments }, { merge: true });

    return newDocuments;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const updateTaskStatus = createAsyncThunk('user/updateTaskStatus', async (props, thunkAPI) => {
  const state = thunkAPI.getState();

  const { id, status } = props;

  const newDocuments = JSON.parse(JSON.stringify(state.user.documents));

  const editObj = (targetFolder) => {
    if (targetFolder.tasks && targetFolder.tasks.length > 0) {
      for (let i = 0; i < targetFolder.tasks.length; i++) {
        if (targetFolder.tasks[i].id === id) {
          targetFolder.tasks[i].status = status;
        }
      }
    }
  };

  findFolder(newDocuments, state.app.path[state.app.path.length - 1], editObj);

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

  findFolder(newDocuments, state.app.path[state.app.path.length - 1], deleteObj);

  try {
    await setDoc(doc(db, 'users', state.user.userId), { documents: newDocuments }, { merge: true });

    return newDocuments;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});






export const dndSwap = createAsyncThunk('user/dndSwap', async (props, thunkAPI) => {
  const state = thunkAPI.getState();

  const { type, items, oldIndex, newIndex } = props;

  const updatedItems = [...items];
  const [movedItem] = updatedItems.splice(oldIndex, 1);
  updatedItems.splice(newIndex, 0, movedItem);

  const documentsCopy = JSON.parse(JSON.stringify(state.user.documents));

  const updateCurrentFolder = targetFolder => targetFolder[type] = updatedItems;
  findFolder(documentsCopy, state.app.path[state.app.path.length - 1], updateCurrentFolder);

  try {
    await setDoc(doc(db, 'users', state.user.userId), { documents: documentsCopy }, { merge: true });

    return documentsCopy;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const dndInside = createAsyncThunk('user/dndInside', async (props, thunkAPI) => {
  const state = thunkAPI.getState();

  const { type, items, oldIndex, newFolderId } = props;

  const updatedItems = [...items];
  const [movedItem] = updatedItems.splice(oldIndex, 1);

  const documentsCopy = JSON.parse(JSON.stringify(state.user.documents));

  const updateNewFolder = targetFolder => targetFolder[type] = [...targetFolder[type], movedItem];
  findFolder(documentsCopy, newFolderId, updateNewFolder);

  const updateCurrentFolder = targetFolder => targetFolder[type].splice(oldIndex, 1);
  findFolder(documentsCopy, state.app.path[state.app.path.length - 1], updateCurrentFolder);

  try {
    await setDoc(doc(db, 'users', state.user.userId), { documents: documentsCopy }, { merge: true });

    return documentsCopy;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const dndOutside = createAsyncThunk('user/dndOutside', async (props, thunkAPI) => {
  const state = thunkAPI.getState();

  const { type, items, oldIndex } = props;

  const updatedItems = [...items];
  const [movedItem] = updatedItems.splice(oldIndex, 1);

  const documentsCopy = JSON.parse(JSON.stringify(state.user.documents));

  const updateParentFolder = targetFolder => targetFolder[type] = [...targetFolder[type], movedItem];
  findFolder(documentsCopy, state.app.path[state.app.path.length - 2], updateParentFolder);

  const updateCurrentFolder = targetFolder => targetFolder[type].splice(oldIndex, 1);
  findFolder(documentsCopy, state.app.path[state.app.path.length - 1], updateCurrentFolder);

  try {
    await setDoc(doc(db, 'users', state.user.userId), { documents: documentsCopy }, { merge: true });

    return documentsCopy;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});





export const {
  updateUserName,
  updateUserPhoto,
  setActiveTaskId,

  setLoadingFetchUser,
  resetUserState
} = userSlice.actions;
export default userSlice.reducer;
