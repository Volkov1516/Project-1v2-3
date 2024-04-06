import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from 'redux/features/app/appSlice';
import { fetchUser, setLoading } from 'redux/features/user/userSlice';
import { auth } from 'firebase.js';
import { onAuthStateChanged } from 'firebase/auth';

import { Auth } from 'components/pages/Auth/Auth';
import { Home } from 'components/pages/Home/Home';

import css from './App.module.css';

export const App = () => {
  const dispatch = useDispatch();

  const { userId, authLoading, error } = useSelector(state => state.user);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      user ? dispatch(fetchUser(user)) : dispatch(setLoading(false));
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
        const themeTag = document.querySelectorAll('meta[name="theme-color"]');
        themeTag[0].setAttribute('content', '#FFFFFF');
        themeTag[1].setAttribute('content', '#FFFFFF');
      }
      else if (theme === 'dark') {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');

        dispatch(setTheme('dark'));
        const themeTag = document.querySelectorAll('meta[name="theme-color"]');
        themeTag[0].setAttribute('content', '#191919');
        themeTag[1].setAttribute('content', '#191919');
      }
    }
    else {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        dispatch(setTheme('dark'));
        document.querySelector('meta[name="theme-color"]').setAttribute('content', '#191919');
      } else {
        dispatch(setTheme('light'));
        document.querySelector('meta[name="theme-color"]').setAttribute('content', '#FFFFFF');
      }
    }
  }, [dispatch]);

  if (authLoading) {
    return (
      <div className={css.spinnerContainer}>
        <div className={css.spinnerIcon} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={css.errorContainer}>
        <div className={css.errorTitle}>Oops!</div>
        <p>{error?.message}</p>
      </div>
    );
  }

  return userId ? <Home /> : <Auth />;
};
