import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme, setSettingsModal } from 'redux/features/app/appSlice';
import { fetchUser, setLoading } from 'redux/features/user/userSlice';
import { auth } from 'firebase.js';
import { onAuthStateChanged } from 'firebase/auth';

import { Auth } from 'components/pages/Auth/Auth';
import { Home } from 'components/pages/Home/Home';

import css from './App.module.css';

export const App = () => {
  const dispatch = useDispatch();

  const { appPathname, navigationState } = useSelector(state => state.app);
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




  // useEffect(() => {
  //   window.history.pushState(null, '', '/');
  // }, []);

  useEffect(() => {
    const handleHashchange = (e) => {
      // e.preventDefault();
      console.log(window.location.hash)
      console.log(e);
      console.log('newUrl', e.newURL);
      console.log('oldUrl', e.oldURL);
      console.log(window.location.host);
      console.log(window.location.hostname);
      console.log(window.location.href);
      console.log(`${window.location.href}settings`);
      if(e.oldURL === `${window.location.href}#settings`) {
        console.log('hre')
        dispatch(setSettingsModal(false));
      }

      // if (navigationState === 'closeNote') {
      //   console.log('s')

      //   const URLPathname = appPathname;
      //   let newPathname = URLPathname.split('/');

      //   for (let i = 0; i < newPathname.length; i++) {
      //     if (newPathname[i].includes('note')) {
      //       newPathname.splice([i], 1);
      //     }
      //   }

      //   window.history.pushState({}, '', newPathname.join('/'));
      //   dispatch(setAppPathname(newPathname.join('/')));
      //   dispatch(setNavigationState(null));
      // }
      // else {
      //   console.log('e')
      //   dispatch(setAppPathname(window.location.pathname));
      // }
    };

    window.addEventListener('hashchange', handleHashchange);

    return () => window.removeEventListener('hashchange', handleHashchange);
  }, [dispatch, appPathname, navigationState]);






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
