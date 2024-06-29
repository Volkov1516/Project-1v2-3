import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setTheme } from 'redux/features/app/appSlice';

const useTheme = () => {
  const dispatch = useDispatch();

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
};

export default useTheme;