import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setTheme, setSnackbar } from 'redux/features/app/appSlice';
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
    const getUser = async (id, email, name, photo) => {
      try {
        const docRef = doc(db, 'users', id);
        const docSnap = await getDoc(docRef);


        dispatch(setUser({
          id,
          email,
          name: docSnap?.data()?.name || name || null,
          photo: docSnap?.data()?.photo || photo || null,
          documents: docSnap?.data()?.documents || {
            id: 'root',
            folders: [],
            notes: [],
            tasks: []
          }
        }));

        setLogged(true);
        setLoading(false);
      } catch (error) {
        dispatch(setSnackbar('Error receiving data'));
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        getUser(user?.uid, user?.email, user?.displayName, user?.photoURL);
      } else {
        setLogged(false);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  useEffect(() => {
    const body = document.body;
    const theme = localStorage.getItem('theme');

    if (theme) {
      if (theme === 'light') {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');

        dispatch(setTheme('light'));
      }
      else if (theme === 'dark') {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');

        dispatch(setTheme('dark'));
      }
    }
    else {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        dispatch(setTheme('dark'));
      } else {
        dispatch(setTheme('light'));
      }
    }
  }, [dispatch]);

  if (loading) {
    return (
      <div className={css.spinnerContainer}>
        <div className={css.spinnerIcon} />
      </div>
    );
  }

  return (
    <div>
      {logged ? <Home /> : <Auth />}
    </div>
  );
};
