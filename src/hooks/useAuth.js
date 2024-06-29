import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserThunk, setAuthLoading } from 'redux/features/user/userSlice';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from 'services/firebase.js';

const useAuth = () => {
  const dispatch = useDispatch();

  const { userId, authObserverLoading, authObserverError } = useSelector(state => state.user);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      if (user) {
        dispatch(fetchUserThunk(user));
      } else {
        dispatch(setAuthLoading(false));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return { userId, authObserverLoading, authObserverError };
};

export default useAuth;