import { lazy, Suspense } from 'react';
import { useAuth, useHistoryReset, useNavigation, useTheme, useWindowResize } from 'hooks';

import { Error, Loading } from 'components';

import { Home } from 'containers/Home/Home';
const LazyAuth = lazy(() => import('containers/Auth/Auth'));

export const App = () => {
  const { userId, authLoading, authError } = useAuth();
  useHistoryReset();
  useNavigation();
  useTheme();
  useWindowResize();

  if (authLoading) return <Loading />;

  if (authError) return <Error error={authError} />;

  return userId ? <Home /> : <Suspense fallback={<Loading />}><LazyAuth /></Suspense>;
};
