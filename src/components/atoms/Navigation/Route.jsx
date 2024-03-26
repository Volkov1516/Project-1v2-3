import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setActiveNote } from 'redux/features/note/noteSlice';

export const Route = ({ path, children }) => {
  const dispatch = useDispatch();

  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    // define callback as separate function so it can be removed later with cleanup function
    const onLocationChange = () => {
      if (window.location.pathname === '/') {
        dispatch(setActiveNote({
          isOpen: false,
          isNew: null,
          id: null,
          title: null,
          content: null,
        }));
      }

      setCurrentPath(window.location.pathname);
    }

    window.addEventListener('popstate', onLocationChange);

    // clean up event listener
    return () => {
      window.removeEventListener('popstate', onLocationChange)
    };
  }, [dispatch]);

  return currentPath === path ? children : null;
};
