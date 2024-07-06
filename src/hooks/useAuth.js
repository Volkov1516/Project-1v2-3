import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setIsModalOpenVerificationEmail } from 'redux/features/app/appSlice';
import { fetchUserThunk, setAuthLoading } from 'redux/features/user/userSlice';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from 'services/firebase.js';

const useAuth = () => {
  const dispatch = useDispatch();

  const { userId, authObserverLoading, authObserverError } = useSelector(state => state.user);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      if (user) {
        if (user.emailVerified) {
          dispatch(fetchUserThunk(user));
        }
        else {
          dispatch(setIsModalOpenVerificationEmail(true));
          dispatch(setAuthLoading(false));
        }
      } else {
        dispatch(setAuthLoading(false));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return { userId, authObserverLoading, authObserverError };
};

export default useAuth;
