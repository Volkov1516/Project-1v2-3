import { lazy, Suspense } from 'react';
import { useAuth, useHistoryReset, useNavigation, useTheme, useWindowResize } from 'hooks';

import { Error, Loading } from 'components';

import { Home } from 'containers/Home/Home';
const LazyAuth = lazy(() => import('containers/Auth/Auth'));

export const App = () => {
  const { userId, authObserverLoading, authObserverError } = useAuth();
  useHistoryReset();
  useNavigation();
  useTheme();
  useWindowResize();

  if (authObserverLoading) return <Loading />;

  if (authObserverError) return <Error error={authObserverError} />;

  return userId ? <Home /> : <Suspense fallback={<Loading />}><LazyAuth /></Suspense>;
};
