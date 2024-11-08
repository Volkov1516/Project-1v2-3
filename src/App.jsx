import { lazy, Suspense, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setWindowWidth, setTheme, setModalGlobalSettings, setAddFolderModal, setModalFolderSettings, setEditNoteModal, setNoteModal, setPath } from 'redux/features/app/appSlice';
import { fetchUser, setLoading } from 'redux/features/user/userSlice';
import { auth } from 'services/firebase.js';
import { onAuthStateChanged } from 'firebase/auth';

import { Home } from 'containers/Home/Home';
import { Loading } from 'components/Loading/Loading';
import { Error } from 'components/Error/Error';

const LazyAuth = lazy(() => import('containers/Auth/Auth'));

export const App = () => {
  const dispatch = useDispatch();

  const { path } = useSelector(state => state.app);
  const { userId, authLoading, error } = useSelector(state => state.user);

  useEffect(() => {
    window.history.replaceState(null, '', '/');
  }, []);

  useEffect(() => {
    dispatch(setWindowWidth(window.innerWidth));

    const handleResize = () => dispatch(setWindowWidth(window.innerWidth));

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => user ? dispatch(fetchUser(user)) : dispatch(setLoading(false)));

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
    const handleHashchange = (e) => {
      if (e.oldURL.includes('#settings')) {
        dispatch(setModalGlobalSettings(false));
      }
      else if (e.oldURL.includes('#addFolder')) {
        dispatch(setAddFolderModal(false));
      }
      else if (e.oldURL.includes('#editFolder')) {
        dispatch(setModalFolderSettings(false));
      }
      else if (e.oldURL.includes('#editNote')) {
        dispatch(setEditNoteModal(false));
      }
      else if (e.oldURL.includes('#editor')) {
        dispatch(setNoteModal(false));
      }
      else if (e.newURL.includes('#folder')) {
        let currentHash = window.location.hash.split('/')[1];

        if (!currentHash) {
          dispatch(setPath(['root']));
        }
        else if (path.includes(currentHash)) {
          let newPath = JSON.parse(JSON.stringify(path));
          newPath.pop();

          dispatch(setPath([...newPath]));
        }
        else {
          dispatch(setPath([...path, currentHash]));
        }
      }
      else if (e.oldURL.includes('#folder') && !window.location.hash) {
        dispatch(setPath(['root']));
      }
    };

    window.addEventListener('hashchange', handleHashchange);

    return () => window.removeEventListener('hashchange', handleHashchange);
  }, [dispatch, path]);

  if (authLoading) return <Loading />;

  if (error) return <Error error={error} />;

  return userId ? <Home /> : <Suspense fallback={<Loading />}><LazyAuth /></Suspense>;
};
