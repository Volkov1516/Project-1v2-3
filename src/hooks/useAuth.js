import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { fetchUser, setLoading } from 'redux/features/user/userSlice';

const useAuth = (auth) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      if (user) {
        dispatch(fetchUser(user));
      } else {
        dispatch(setLoading(false));
      }
    });

    return () => unsubscribe();
  }, [auth, dispatch]);
};

export default useAuth;