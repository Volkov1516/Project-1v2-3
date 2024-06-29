import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit';

import { db, storage } from 'services/firebase.js';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';

import { findFolder } from 'utils/searchInManager.js';

const initialState = {
  userId: null,
  userEmail: null,
  userName: null,
  userPhoto: null,
  documents: null,
  activeTaskId: null,
  documentsLoading: false,
  error: null,

  authLoading: true,
  authError: false,
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
    setAuthLoading: (state, action) => {
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
        state.authError = action.error;
        state.authLoading = false;
      })
      .addMatcher(isAnyOf(
        createInDocuments.pending,
        updateInDocuments.pending,
        deleteFromDocuments.pending,
        updateTaskStatus.pending,
        moveFromFolder.pending,
        moveInFolder.pending,
        moveFolder.pending,
        moveUniversal.pending,
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
        moveFromFolder.fulfilled,
        moveInFolder.fulfilled,
        moveFolder.fulfilled,
        moveUniversal.fulfilled,
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
        moveFromFolder.rejected,
        moveInFolder.rejected,
        moveFolder.rejected,
        moveUniversal.rejected,
        dndSwap.rejected,
        dndInside.rejected,
        dndOutside.rejected,
      ), (state, action) => {
        state.error = action.error;
        state.documentsLoading = false;
      }
      )
  }
});

export const fetchUser = createAsyncThunk('user/fetchUser', async (user) => {
  const docRef = doc(db, 'users', user?.uid);
  const docSnap = await getDoc(docRef);

  let avatar;
  const storageRef = ref(storage, `images/avatars/${user?.uid}`);
  await getDownloadURL(storageRef).then(res => avatar = res).catch(err => console.error(err));

  return {
    id: user?.uid,
    email: user?.email,
    name: docSnap?.data()?.name || user?.displayName || null,
    photo: avatar || null,
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

export const moveFromFolder = createAsyncThunk('user/moveFromFolder', async (props, thunkAPI) => {
  const state = thunkAPI.getState();

  const { folder, index, type } = props;

  const documentsCopy = JSON.parse(JSON.stringify(state.user.documents));
  const draggableArrayCopy = JSON.parse(JSON.stringify(folder[type]));
  const draggableObject = draggableArrayCopy[index];
  draggableArrayCopy.splice(index, 1);

  const removeDraggable = targetFolder => targetFolder[type] = draggableArrayCopy;
  findFolder(documentsCopy, state.app.path[state.app.path.length - 1], removeDraggable);

  const moveDraggableOutside = targetFolder => targetFolder[type].push(draggableObject);
  findFolder(documentsCopy, state.app.path[state.app.path.length - 2], moveDraggableOutside);

  try {
    await setDoc(doc(db, 'users', state.user.userId), { documents: documentsCopy }, { merge: true });

    return documentsCopy;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const moveInFolder = createAsyncThunk('user/moveInFolder', async (props, thunkAPI) => {
  const state = thunkAPI.getState();

  const { folder, targetIndex, draggableIndex, type } = props;

  const documentsCopy = JSON.parse(JSON.stringify(state.user.documents));

  const removeDraggable = targetFolder => {
    // Move draggable into target fodler
    targetFolder.folders[targetIndex][type].push(folder[type][draggableIndex]);
    // Delete draggable from current place
    targetFolder[type].splice(draggableIndex, 1);
  };
  findFolder(documentsCopy, state.app.path[state.app.path.length - 1], removeDraggable);

  try {
    await setDoc(doc(db, 'users', state.user.userId), { documents: documentsCopy }, { merge: true });

    return documentsCopy;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const moveFolder = createAsyncThunk('user/moveFodler', async (props, thunkAPI) => {
  const state = thunkAPI.getState();

  const { newFolders } = props;

  const documentsCopy = JSON.parse(JSON.stringify(state.user.documents));

  const changeFolderPosition = targetFolder => targetFolder.folders = newFolders;
  findFolder(documentsCopy, state.app.path[state.app.path.length - 1], changeFolderPosition);

  try {
    await setDoc(doc(db, 'users', state.user.userId), { documents: documentsCopy }, { merge: true });

    return documentsCopy;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const moveUniversal = createAsyncThunk('user/moveUniversal', async (props, thunkAPI) => {
  const state = thunkAPI.getState();

  const { newObj, type } = props;

  const documentsCopy = JSON.parse(JSON.stringify(state.user.documents));

  const changeElementPosition = targetFolder => targetFolder[type] = newObj;
  findFolder(documentsCopy, state.app.path[state.app.path.length - 1], changeElementPosition);

  try {
    await setDoc(doc(db, 'users', state.user.userId), { documents: documentsCopy }, { merge: true });

    return documentsCopy;
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
  setUser,
  updateUserName,
  updateUserPhoto,
  updateDocuments,
  setActiveTaskId,
  
  setAuthLoading
} = userSlice.actions;
export default userSlice.reducer;
