import { useState, useEffect, lazy, Suspense } from 'react';
import { useDispatch } from 'react-redux';
import { SET_USER, SET_CATEGORIES } from 'redux/features/user/userSlice';
import { setArticles, setFilteredArticlesId, setIsNewArticle } from 'redux/features/article/articleSlice';
import { SET_MODAL_PREVIEW, SET_MODAL_EDITOR_EXISTING, SET_MODAL_EDITOR_EMPTY, SET_MODAL_SCROLL } from 'redux/features/modal/modalSlice';
import { auth, db } from 'firebase.js';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, collection, query, where, orderBy, getDocs, getDoc } from 'firebase/firestore';
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

    const getCategories = async (user) => {
      const docRef = doc(db, 'categories', user?.uid);
      const docSnap = await getDoc(docRef);

      dispatch(SET_CATEGORIES(docSnap?.data()?.categories));
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(SET_USER({ id: user?.uid, email: user?.email }));
        getArticles(user);
        getCategories(user);
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
      if (e.state && e.state.modalPreview === 'opened') {
        dispatch(SET_MODAL_PREVIEW(true));
      }
      else {
        dispatch(SET_MODAL_PREVIEW(false));
      }

      if (e.state && e.state.modalEditor === 'opened') {
        dispatch(SET_MODAL_EDITOR_EXISTING(true));
      }
      else {
        dispatch(setIsNewArticle(false));
        dispatch(SET_MODAL_EDITOR_EXISTING(false));

        const modalEditorElement = document.getElementById('modalEditor');
        dispatch(SET_MODAL_SCROLL(modalEditorElement?.scrollTop));
      }

      if (e.state && e.state.modalEditorEmpty === 'opened') {
        dispatch(SET_MODAL_EDITOR_EMPTY(true));
      }
      else {
        dispatch(setIsNewArticle(false));
        dispatch(SET_MODAL_EDITOR_EMPTY(false));
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => window.removeEventListener('popstate', handlePopState);
  }, [dispatch]);

  return logged
    ? <Suspense fallback={<Loading />}><LazyHomeComponent /></Suspense>
    : <Suspense fallback={<Loading />}><LazyAuthComponent /></Suspense>;
};
