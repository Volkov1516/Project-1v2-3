import { useState, useEffect, lazy, Suspense } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from 'redux/features/user/userSlice';
import { setArticles, setFilteredArticlesId } from 'redux/features/article/articleSlice';
import { setModalSettings, setModalGlobalSettings, setEditorModalStatus, setModalCategories, setModalDeleteArticle } from 'redux/features/modal/modalSlice';
import { auth, db } from 'firebase.js';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, getDocs, collection, query, where, orderBy } from 'firebase/firestore';

import { Loading } from 'components/Loading/Loading';

const LazyAuthComponent = lazy(() => import('components/Auth/Auth'));
const LazyHomeComponent = lazy(() => import('components/Home/Home'));

export const App = () => {
  const dispatch = useDispatch();
  const [logged, setLogged] = useState(true);

  useEffect(() => {
    const getArticles = async (user) => {
      const articles = [];
      const filteredArticlesId = [];

      const q = query(collection(db, 'articles'), where('userId', '==', user?.uid), orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      querySnapshot?.forEach((doc) => articles.push({
        id: doc?.id,
        title: doc?.data()?.title,
        content: doc?.data()?.content,
        categories: doc?.data()?.categories,
        color: doc?.data()?.color,
        date: doc?.data()?.date?.toDate().toLocaleDateString(),
        archive: doc?.data()?.archive,
      }));
      articles?.forEach(i => !i?.archive && filteredArticlesId.push(i?.id));

      dispatch(setArticles(JSON.parse(JSON.stringify(articles))));
      dispatch(setFilteredArticlesId(filteredArticlesId));
    };

    const getUser = async (id, email) => {
      const docRef = doc(db, 'users', id);
      const docSnap = await getDoc(docRef);

      dispatch(setUser({ id, email, categories: docSnap?.data()?.categories }));
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        getUser(user?.uid, user?.email);
        getArticles(user);
        setLogged(true);

        window.history.pushState({}, '', '/');
      } else {
        setLogged(false);
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

    // popstate - событие, которое срабатывает, когда изменяется история браузера. Например, через кнопки "назад" и "вперед"
    window.addEventListener('popstate', handlePopState);

    return () => window.removeEventListener('popstate', handlePopState);
  }, [dispatch]);

  return logged
    ? <Suspense fallback={<Loading />}><LazyHomeComponent /></Suspense>
    : <Suspense fallback={<Loading />}><LazyAuthComponent /></Suspense>;
};
