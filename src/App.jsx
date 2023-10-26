import { useState, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { SET_AUTH, SET_USER, SET_CATEGORIES } from 'redux/features/user/userSlice';
import { SET_ORIGINAL_ARTICLES, SET_FILTERED_ARTICLES, SET_NEW_ARTICLE } from 'redux/features/article/articleSlice';
import { SET_MODAL_PREVIEW, SET_MODAL_EDITOR_EXISTING, SET_MODAL_EDITOR_EMPTY } from 'redux/features/modal/modalSlice';

import { auth, db } from 'firebase.js';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, collection, query, where, orderBy, getDocs, getDoc } from 'firebase/firestore';

import { Auth } from 'components/templates/Auth/Auth';
import { Home } from 'components/templates/Home/Home';
import { Loading } from 'components/templates/Loading/Loading';

export const App = () => {
  const dispatch = useDispatch();
  const { logged } = useSelector(state => state.user);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getArticles = async (user) => {
      const originalArticles = [];
      const q = query(collection(db, 'articles'), where('userId', '==', user?.uid), orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      querySnapshot?.forEach((doc) => originalArticles.push({
        id: doc?.id,
        title: doc?.data()?.title,
        content: doc?.data()?.content,
        categories: doc?.data()?.categories,
        color: doc?.data()?.color,
        date: doc?.data()?.date?.toDate().toLocaleDateString(),
        archive: doc?.data()?.archive,
      }));
      const archivedArticles = originalArticles?.filter(i => !i?.archive);

      dispatch(SET_ORIGINAL_ARTICLES(JSON.parse(JSON.stringify(originalArticles))));
      dispatch(SET_FILTERED_ARTICLES(JSON.parse(JSON.stringify(archivedArticles))));
    };

    const getCategories = async (user) => {
      const docRef = doc(db, 'categories', user?.uid);
      const docSnap = await getDoc(docRef);

      dispatch(SET_CATEGORIES(docSnap?.data()?.categories));
    };

    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(SET_AUTH(true));
        dispatch(SET_USER({ id: user?.uid }));
        getArticles(user);
        getCategories(user);
        setLoading(false);

        window.history.pushState({}, '', '/');
      } else {
        dispatch(SET_AUTH(false));
        setLoading(false);
      }
    });
  }, [dispatch]);

  useEffect(() => {
    const handlePopState = (e) => {
      if(e.state && e.state.modalPreview === 'opened') {
        dispatch(SET_MODAL_PREVIEW(true));
      }
      else {
        dispatch(SET_MODAL_PREVIEW(false));
      }

      if(e.state && e.state.modalEditor === 'opened') {
        dispatch(SET_MODAL_EDITOR_EXISTING(true));
      }
      else {
        dispatch(SET_NEW_ARTICLE(false));
        dispatch(SET_MODAL_EDITOR_EXISTING(false));
      }

      if(e.state && e.state.modalEditorEmpty === 'opened') {
        dispatch(SET_MODAL_EDITOR_EMPTY(true));
      }
      else {
        dispatch(SET_NEW_ARTICLE(false));
        dispatch(SET_MODAL_EDITOR_EMPTY(false));
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => window.removeEventListener('popstate', handlePopState);
  }, [dispatch]);

  return loading ? <Loading /> : logged ? <Home /> : <Auth />;
};
