import { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { auth } from 'services/firebase.js';
import { useAuth, useHistoryReset, useNavigation, useTheme, useWindowResize } from 'hooks';

import { Home } from 'containers/Home/Home';
import { Loading } from 'components/Loading/Loading';
import { Error } from 'components/Error/Error';

const LazyAuth = lazy(() => import('containers/Auth/Auth'));

export const App = () => {
  const { userId, authLoading, error } = useSelector(state => state.user);

  useAuth(auth);
  useHistoryReset();
  useNavigation();
  useTheme();
  useWindowResize();

  if (authLoading) return <Loading />;

  if (error) return <Error error={error} />;

  return userId ? <Home /> : <Suspense fallback={<Loading />}><LazyAuth /></Suspense>;
};
