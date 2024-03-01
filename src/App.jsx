import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setSnackbar } from 'redux/features/app/appSlice';
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
