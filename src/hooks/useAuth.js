import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setIsModalOpenVerificationEmail } from 'redux/features/app/appSlice';
import { fetchUserThunk, setLoadingFetchUser } from 'redux/features/user/userSlice';
import { fetchTreeThunk, setLoadingFetchTree } from 'redux/features/tree/treeSlice';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from 'services/firebase.js';

const useAuth = () => {
  const dispatch = useDispatch();

  const { userId, loadingFetchUser, errorFetchUser } = useSelector(state => state.user);
  const { loadingFetchTree, errorFetchTree } = useSelector(state => state.tree);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      if (user) {
        if (user.emailVerified) {
          const { uid, email, displayName, photoURL } = user;

          dispatch(fetchUserThunk({ uid, email, displayName, photoURL }));
          dispatch(fetchTreeThunk({ uid }));
        }
        else {
          dispatch(setIsModalOpenVerificationEmail(true));
          dispatch(setLoadingFetchUser(false));
          dispatch(setLoadingFetchTree(false));
        }
      } else {
        dispatch(setLoadingFetchUser(false));
        dispatch(setLoadingFetchTree(false));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return { userId, loadingFetchUser, errorFetchUser, loadingFetchTree, errorFetchTree };
};

export default useAuth;
