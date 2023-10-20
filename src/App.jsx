import { useState, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { SET_AUTH, SET_USER, SET_CATEGORIES } from 'redux/features/user/userSlice';
import { SET_ORIGINAL_ARTICLES, SET_FILTERED_ARTICLES } from 'redux/features/article/articleSlice';

import { auth, db } from 'firebase.js';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, collection, query, where, getDocs, getDoc } from 'firebase/firestore';

import { Auth } from 'components/templates/Auth/Auth';
import { Home } from 'components/templates/Home/Home';
import { Loading } from 'components/templates/Loading/Loading';

export const App = () => {
  const dispatch = useDispatch();
  const { logged } = useSelector(state => state.user);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getArticles = async (res) => {
      const q = query(collection(db, 'articles'), where('userId', '==', res?.uid));
      const querySnapshot = await getDocs(q);

      dispatch(SET_ORIGINAL_ARTICLES(querySnapshot.docs));
      const unarchived = querySnapshot.docs?.filter(i => !i?.data()?.archive);
      dispatch(SET_FILTERED_ARTICLES(unarchived));
    };

    const getCategories = async (res) => {
      const docRef = doc(db, 'categories', res?.uid);
      const docSnap = await getDoc(docRef);

      dispatch(SET_CATEGORIES(docSnap?.data()?.categories));
    };

    onAuthStateChanged(auth, (res) => {
      if (res) {
        dispatch(SET_AUTH(true));
        dispatch(SET_USER({ id: res?.uid }));
        getArticles(res);
        getCategories(res);
        setLoading(false);
      } else {
        dispatch(SET_AUTH(false));
        setLoading(false);
      }
    });
  }, [dispatch]);

  return loading ? <Loading /> : logged ? <Home /> : <Auth />;
};
