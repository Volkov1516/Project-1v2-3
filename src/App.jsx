import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme, setAppPathname } from 'redux/features/app/appSlice';
import { fetchUser, setLoading } from 'redux/features/user/userSlice';
import { auth } from 'firebase.js';
import { onAuthStateChanged } from 'firebase/auth';

import { Auth } from 'components/pages/Auth/Auth';
import { Home } from 'components/pages/Home/Home';

import css from './App.module.css';

export const App = () => {
  const dispatch = useDispatch();

  const { appPathname } = useSelector(state => state.app);
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

    const newThemeTag = document.createElement('meta');
    newThemeTag.setAttribute('name', 'theme-color');

    if (theme) {
      if (theme === 'light') {
        newThemeTag.setAttribute('content', '#FFFFFF');

        body.classList.remove('dark-theme');
        body.classList.add('light-theme');

        dispatch(setTheme('light'));
      }
      else if (theme === 'dark') {
        newThemeTag.setAttribute('content', '#191919');

        body.classList.remove('light-theme');
        body.classList.add('dark-theme');

        dispatch(setTheme('dark'));
      }
    }
    else {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        newThemeTag.setAttribute('content', '#191919');

        body.classList.remove('light-theme');
        body.classList.add('dark-theme');

        dispatch(setTheme('dark'));
      } else {
        newThemeTag.setAttribute('content', '#FFFFFF');

        body.classList.remove('dark-theme');
        body.classList.add('light-theme');

        dispatch(setTheme('light'));
      }
    }

    document.head.appendChild(newThemeTag);
  }, [dispatch]);




  useEffect(() => {
    window.history.replaceState(null, '', '/');
  }, []);

  useEffect(() => {
    const handlePopstate = (e) => {
      dispatch(setAppPathname(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopstate);

    return () => window.removeEventListener('popstate', handlePopstate);
  }, [dispatch, appPathname]);






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
