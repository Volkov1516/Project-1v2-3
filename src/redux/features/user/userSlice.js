import { createSlice } from '@reduxjs/toolkit';
import { setSnackbar } from '../app/appSlice.js';

import { db, auth } from '../../../firebase.js';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

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
  }
});

export const observeAuthState = () => dispatch => {
  const unsubscribe = onAuthStateChanged(auth, async user => {
    if (user) {
      try {
        const docRef = doc(db, 'users', user?.uid);
        const docSnap = await getDoc(docRef);

        dispatch(setUser({
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
        }));
        dispatch(setLogged(true));
      } catch (error) {
        dispatch(setLogged(false));
        dispatch(setSnackbar('Error receiving data'));
        dispatch(setError(error));
      }
    } else {
      dispatch(setLogged(false));
    }

    dispatch(setLoading(false));
  });

  return () => unsubscribe();
};

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
