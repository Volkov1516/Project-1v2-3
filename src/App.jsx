import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from 'redux/features/user/userSlice';
import { setDocuments, setFilteredDocumentsId } from 'redux/features/document/documentSlice';
import {
  setEditorModalStatus,
  setDocumentSettingsModal,
  setDocumentDeleteModal,
  setCategoriesModal,
  setSettingsModal,
} from 'redux/features/modal/modalSlice';
import { auth, db } from 'firebase.js';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, getDocs, collection, query, where, orderBy } from 'firebase/firestore';

import { Auth } from 'components/Auth/Auth';
import { Home } from 'components/Home/Home';

import css from './App.module.css';

export const App = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    const getUser = async (id, email) => {
      const docRef = doc(db, 'users', id);
      const docSnap = await getDoc(docRef);

      dispatch(setUser({ id, email, categories: docSnap?.data()?.categories }));
    };

    const getDocuments = async (id) => {
      const q = query(collection(db, 'documents'), where('userId', '==', id), orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      const documents = querySnapshot.docs.map(i => ({ id: i?.id, ...i.data() }));
      dispatch(setDocuments(JSON.parse(JSON.stringify(documents))));

      const filteredDocumentsId = [];
      documents?.forEach(i => !i?.archive && filteredDocumentsId.push(i?.id));
      dispatch(setFilteredDocumentsId(filteredDocumentsId));

      setLogged(true);
      setLoading(false);
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        getUser(user?.uid, user?.email);
        getDocuments(user?.uid);
        window.history.pushState({}, '', '/');
      } else {
        setLogged(false);
        setLoading(false);
        window.history.pushState({}, '', '/');
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  useEffect(() => {
    const handlePopState = (e) => {
      if (e.state && !e.state.modal) {
        dispatch(setEditorModalStatus(false));
        dispatch(setSettingsModal(false));
        dispatch(setCategoriesModal(false));
      }
      else if (e.state && e.state.modal === 'editorModalNew') {
        dispatch(setEditorModalStatus('editorModalNew'));
        dispatch(setDocumentSettingsModal(false));
      }
      else if (e.state && e.state.modal === 'editorModalFromComponent') {
        dispatch(setEditorModalStatus('editorModalFromComponent'));
        dispatch(setDocumentSettingsModal(false));
      }
      else if (e.state && e.state.modal === 'editorModalFromPreview') {
        dispatch(setEditorModalStatus('editorModalFromPreview'));
        dispatch(setDocumentSettingsModal(false));
      }
      else if (e.state && e.state.modal === 'preview') {
        dispatch(setEditorModalStatus('preview'));
        dispatch(setDocumentSettingsModal(false));
      }
      else if (e.state && e.state.modal === 'articleSettings') {
        dispatch(setDocumentSettingsModal(true));
        dispatch(setDocumentDeleteModal(false));
      }
      else if (e.state && e.state.modal === 'deleteArticle') {
        dispatch(setDocumentDeleteModal(true));
      }
      else if (e.state && e.state.modal === 'settings') {
        dispatch(setSettingsModal(true));
      }
      else if (e.state && e.state.modal === 'categories') {
        dispatch(setCategoriesModal(true));
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => window.removeEventListener('popstate', handlePopState);
  }, [dispatch]);

  return loading
    ? <div className={css.container}><div className={css.spinner} /></div>
    : logged ? <Home /> : <Auth />;
};
