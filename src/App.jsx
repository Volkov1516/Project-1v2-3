import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from 'redux/features/user/userSlice';
import { auth, db } from 'firebase.js';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

import { Auth } from 'components/pages/Auth/Auth';
import { Home } from 'components/pages/Home/Home';
import { Snackbar } from 'components/atoms/Snackbar/Snackbar';

import css from './App.module.css';

export const App = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [logged, setLogged] = useState(false);
  const [snackbarError, setSnackbarError] = useState(null);

  useEffect(() => {
    const getUser = async (id, email) => {
      try {
        const docRef = doc(db, 'users', id);
        const docSnap = await getDoc(docRef);

        dispatch(setUser({
          id, email, documents: docSnap?.data()?.documents || {
            id: 'root',
            folders: [],
            notes: [],
            tasks: []
          }
        }));

        setLogged(true);
        setLoading(false);
      } catch (error) {
        setSnackbarError('Error receiving data');
      }
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
      <Snackbar message={snackbarError} />
    </div>
  );
};
