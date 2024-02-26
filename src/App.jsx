import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from 'redux/features/user/userSlice';
import { auth, db } from 'firebase.js';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

import { Auth } from 'components/pages/Auth/Auth';
import { Home } from 'components/pages/Home/Home';

import css from './App.module.css';

export const App = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    const getUser = async (id, email) => {
      const docRef = doc(db, 'users', id);
      const docSnap = await getDoc(docRef);

      dispatch(setUser({ id, email, documents: docSnap?.data()?.documents || {
        id: 'root',
        folders: [],
        notes: [],
        tasks: []
      }}));
      setLogged(true);
      setLoading(false);
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        getUser(user?.uid, user?.email);
      } else {
        setLogged(false);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return loading
    ? <div className={css.container}><div className={css.spinner} /></div>
    : logged ? <Home /> : <Auth />;
};
