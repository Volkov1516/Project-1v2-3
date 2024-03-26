import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setTheme } from 'redux/features/app/appSlice';

import { Bar } from './Bar/Bar';
import { Manager } from './Manager/Manager';
import { EditorModal } from './EditorModal/EditorModal';
import { Snackbar } from 'components/atoms/Snackbar/Snackbar';

import css from './Home.module.css';
import { Route } from 'components/atoms/Navigation/Route';

export const Home = () => {
  const dispatch = useDispatch();

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

  return (
    <div className={css.container}>
      <Bar />
      <Manager />
      <Route path="/editor">
        <EditorModal />
      </Route>
      <Snackbar />
    </div>
  );
};
