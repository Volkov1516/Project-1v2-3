import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from 'redux/features/user/userSlice';
import { setDocuments, setFilteredDocumentsId } from 'redux/features/document/documentSlice';
import {
  setModalSettings,
  setModalGlobalSettings,
  setEditorModalStatus,
  setModalCategories,
  setModalDeleteArticle
} from 'redux/features/modal/modalSlice';
import { auth, db } from 'firebase.js';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, getDocs, collection, query, where, orderBy } from 'firebase/firestore';

import { Loading } from 'components/Loading/Loading';
import { Auth } from 'components/Auth/Auth';
import { Home } from 'components/Home/Home';

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
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        getUser(user?.uid, user?.email);
        getDocuments(user?.uid);
        setLogged(true);
        setLoading(false);
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
        dispatch(setModalGlobalSettings(false));
        dispatch(setModalCategories(false));
      }
      else if (e.state && e.state.modal === 'new') {
        dispatch(setEditorModalStatus('edit'));
        dispatch(setModalSettings(false));
      }
      else if (e.state && e.state.modal === 'editFC') {
        dispatch(setEditorModalStatus('editFC'));
        dispatch(setModalSettings(false));
      }
      else if (e.state && e.state.modal === 'preview') {
        dispatch(setEditorModalStatus('preview'));
        dispatch(setModalSettings(false));
      }
      else if (e.state && e.state.modal === 'editFP') {
        dispatch(setEditorModalStatus('editFP'));
        dispatch(setModalSettings(false));
      }
      else if (e.state && e.state.modal === 'articleSettings') {
        dispatch(setModalSettings(true));
        dispatch(setModalDeleteArticle(false));
      }
      else if (e.state && e.state.modal === 'deleteArticle') {
        dispatch(setModalDeleteArticle(true));
      }
      else if (e.state && e.state.modal === 'globalSettings') {
        dispatch(setModalGlobalSettings(true));
      }
      else if (e.state && e.state.modal === 'categories') {
        dispatch(setModalCategories(true));
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => window.removeEventListener('popstate', handlePopState);
  }, [dispatch]);

  return loading ? <Loading /> : logged ? <Home /> : <Auth />;
};
