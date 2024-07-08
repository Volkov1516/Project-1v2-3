// [] 1. Перенести сюда path.
// [x] 2. fetchTreeThunk - в observer надо получать и user и tree.
// [x] 2.1. Как обрабатывать loading и error для user и tree в observer?
// [] 2.2. Как правильно устанавливать данные в Redux?
// [] 3. create/update/delete...(folder, note, task) - вместе или отдельно?
// [] 4. Перенести dnd...Thunk.

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from 'services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import { findFolder } from 'utils/searchInManager.js';

const initialState = {
  tree: null,
  path: ['root'],
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
  }
});

export const fetchTreeThunk = createAsyncThunk('tree/fetchTreeThunk', async ({ uid }, thunkAPI) => {
  try {
    const treeRef = doc(db, 'trees', uid);
    const treeSnap = await getDoc(treeRef);
    // Here I need to serealize data.
    const treeData = treeSnap.exists() ? treeSnap.data() : null;

    return treeData;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});





export const createInTreeThunk = createAsyncThunk('tree/createInTreeThunk', async ({ type, obj }, thunkAPI) => {
  const state = thunkAPI.getState();

  // Это неправльно? Может, стоит что-то менять во время установки?
  const newDocuments = JSON.parse(JSON.stringify(state.user.documents));

  const createObj = targetFolder => targetFolder[type].unshift(obj);

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

export const { setPath, setLoadingFetchTree, resetTreeState } = treeSlice.actions;
export default treeSlice.reducer;
