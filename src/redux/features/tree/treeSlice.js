import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit';
import { db } from 'services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import { findFolder } from 'utils/searchInManager.js';

const initialState = {
  tree: null,
  path: ['root'],
  activeTaskId: null,
  loadingTree: false,
  errorTree: false,
  loadingFetchTree: true,
  errorFetchTree: false,
};

export const treeSlice = createSlice({
  name: 'tree',
  initialState,
  reducers: {
    setPath: (state, action) => {
      state.path = action.payload;
    },
    setActiveTaskId: (state, action) => {
      state.activeTaskId = action.payload;
    },
    setLoadingFetchTree: (state, action) => {
      state.loadingFetchTree = action.payload;
    },
    resetTreeState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTreeThunk.pending, (state) => {
        state.loadingFetchTree = true;
      })
      .addCase(fetchTreeThunk.fulfilled, (state, action) => {
        state.tree = action.payload;
        state.loadingFetchTree = false;
      })
      .addCase(fetchTreeThunk.rejected, (state, action) => {
        state.errorFetchTree = action.error;
        state.loadingFetchTree = false;
      })
      .addMatcher(isAnyOf(
        createInTreeThunk.pending,
        updateInTreeThunk.pending,
        updateTaskStatusThunk.pending,
        deleteInTreeThunk.pending,
        dndSwapThunk.pending,
        dndInsideThunk.pending,
        dndOutsideThunk.pending,
      ), (state) => {
        state.loadingTree = true;
      })
      .addMatcher(isAnyOf(
        createInTreeThunk.fulfilled,
        updateInTreeThunk.fulfilled,
        updateTaskStatusThunk.fulfilled,
        deleteInTreeThunk.fulfilled,
        dndSwapThunk.fulfilled,
        dndInsideThunk.fulfilled,
        dndOutsideThunk.fulfilled,
      ), (state, action) => {
        state.tree = action.payload;
        state.loadingTree = false;
      })
      .addMatcher(isAnyOf(
        createInTreeThunk.rejected,
        updateInTreeThunk.rejected,
        updateTaskStatusThunk.rejected,
        deleteInTreeThunk.rejected,
        dndSwapThunk.rejected,
        dndInsideThunk.rejected,
        dndOutsideThunk.rejected,
      ), (state, action) => {
        state.errorTree = action.error;
        state.loadingTree = false;
      })
  }
});

export const fetchTreeThunk = createAsyncThunk('tree/fetchTreeThunk', async ({ uid }, thunkAPI) => {
  try {
    const tree = {
      id: 'root',
      folders: [],
      notes: [],
      tasks: [],
    };

    const treeRef = doc(db, 'trees', uid);
    const treeSnap = await getDoc(treeRef);

    if (treeSnap.exists()) {
      tree.folders = treeSnap.data().folders;
      tree.notes = treeSnap.data().notes;
      tree.tasks = treeSnap.data().tasks;
    }

    return tree;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const createInTreeThunk = createAsyncThunk('tree/createInTreeThunk', async ({ type, obj }, thunkAPI) => {
  try {
    const state = thunkAPI.getState();

    const newTree = JSON.parse(JSON.stringify(state.tree.tree));
    const createObj = folder => folder[type].unshift(obj);
    findFolder(newTree, state.tree.path[state.tree.path.length - 1], createObj);

    if (type !== 'tasks') {
      await setDoc(doc(db, 'trees', state.user.userId), { ...newTree }, { merge: true });
    }

    return newTree;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const updateInTreeThunk = createAsyncThunk('user/updateInTreeThunk', async ({ type, id, name, value }, thunkAPI) => {
  try {
    const state = thunkAPI.getState();

    const newTree = JSON.parse(JSON.stringify(state.tree.tree));

    const editObj = (targetFolder) => {
      if (targetFolder[type] && targetFolder[type].length > 0) {
        for (let i = 0; i < targetFolder[type].length; i++) {
          if (targetFolder[type][i].id === id) {
            targetFolder[type][i][name] = value;
          }
        }
      }
    };

    findFolder(newTree, state.tree.path[state.tree.path.length - 1], editObj);

    await setDoc(doc(db, 'trees', state.user.userId), { ...newTree }, { merge: true });

    return newTree;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const updateTaskStatusThunk = createAsyncThunk('user/updateTaskStatusThunk', async ({ id, status }, thunkAPI) => {
  try {
    const state = thunkAPI.getState();

    const newTree = JSON.parse(JSON.stringify(state.tree.tree));

    const editObj = (targetFolder) => {
      if (targetFolder.tasks && targetFolder.tasks.length > 0) {
        for (let i = 0; i < targetFolder.tasks.length; i++) {
          if (targetFolder.tasks[i].id === id) {
            targetFolder.tasks[i].status = status;
          }
        }
      }
    };

    findFolder(newTree, state.tree.path[state.tree.path.length - 1], editObj);

    await setDoc(doc(db, 'trees', state.user.userId), { ...newTree }, { merge: true });

    return newTree;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const deleteInTreeThunk = createAsyncThunk('user/deleteInTreeThunk', async ({ type, id }, thunkAPI) => {
  try {
    const state = thunkAPI.getState();

    const newTree = JSON.parse(JSON.stringify(state.tree.tree));

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

    findFolder(newTree, state.tree.path[state.tree.path.length - 1], deleteObj);

    await setDoc(doc(db, 'trees', state.user.userId), { ...newTree }, { merge: true });

    return newTree;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const dndSwapThunk = createAsyncThunk('user/dndSwapThunk', async ({ type, items, oldIndex, newIndex }, thunkAPI) => {
  try {
    const state = thunkAPI.getState();

    const updatedItems = [...items];
    const [movedItem] = updatedItems.splice(oldIndex, 1);
    updatedItems.splice(newIndex, 0, movedItem);
  
    const newTree = JSON.parse(JSON.stringify(state.tree.tree));
    const updateCurrentFolder = targetFolder => targetFolder[type] = updatedItems;
    findFolder(newTree, state.tree.path[state.tree.path.length - 1], updateCurrentFolder);

    await setDoc(doc(db, 'trees', state.user.userId), { ...newTree }, { merge: true });

    return newTree;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const dndInsideThunk = createAsyncThunk('user/dndInsideThunk', async ({ type, items, oldIndex, newFolderId }, thunkAPI) => {
  try {
    const state = thunkAPI.getState();

    const updatedItems = [...items];
    const [movedItem] = updatedItems.splice(oldIndex, 1);
  
    const newTree = JSON.parse(JSON.stringify(state.tree.tree));
    const updateNewFolder = targetFolder => targetFolder[type] = [...targetFolder[type], movedItem];
    findFolder(newTree, newFolderId, updateNewFolder);
  
    const updateCurrentFolder = targetFolder => targetFolder[type].splice(oldIndex, 1);
    findFolder(newTree, state.tree.path[state.tree.path.length - 1], updateCurrentFolder);
  
    await setDoc(doc(db, 'trees', state.user.userId), { ...newTree }, { merge: true });

    return newTree;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const dndOutsideThunk = createAsyncThunk('user/dndOutsideThunk', async ({ type, items, oldIndex }, thunkAPI) => {
  try {
    const state = thunkAPI.getState();

    const updatedItems = [...items];
    const [movedItem] = updatedItems.splice(oldIndex, 1);
  
    const newTree = JSON.parse(JSON.stringify(state.tree.tree));
  
    const updateParentFolder = targetFolder => targetFolder[type] = [...targetFolder[type], movedItem];
    findFolder(newTree, state.tree.path[state.tree.path.length - 2], updateParentFolder);
  
    const updateCurrentFolder = targetFolder => targetFolder[type].splice(oldIndex, 1);
    findFolder(newTree, state.tree.path[state.tree.path.length - 1], updateCurrentFolder);
  
    await setDoc(doc(db, 'trees', state.user.userId), { ...newTree }, { merge: true });

    return newTree;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const { setPath, setActiveTaskId, setLoadingFetchTree, resetTreeState } = treeSlice.actions;
export default treeSlice.reducer;
