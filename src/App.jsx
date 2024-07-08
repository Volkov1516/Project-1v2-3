import { lazy, Suspense } from 'react';
import { useAuth, useHistoryReset, useNavigation, useTheme, useWindowResize } from 'hooks';

import { Error, Loading } from 'components';

import { Home } from 'containers/Home/Home';
const LazyAuth = lazy(() => import('containers/Auth/Auth'));

export const App = () => {
  const { userId, loadingFetchUser, errorFetchUser, loadingFetchTree, errorFetchTree } = useAuth();
  useHistoryReset();
  useNavigation();
  useTheme();
  useWindowResize();

  if (loadingFetchUser || loadingFetchTree) return <Loading />;

  if (errorFetchUser || errorFetchTree) return <Error error={errorFetchUser || errorFetchTree} />;

  return userId ? <Home /> : <Suspense fallback={<Loading />}><LazyAuth /></Suspense>;
};
