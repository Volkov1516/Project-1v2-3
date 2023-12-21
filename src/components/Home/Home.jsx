import { lazy, Suspense } from 'react';

import css from './Home.module.css';

import { Sidebar } from './Sidebar/Sidebar';
import { Content } from './Content/Content';

const LazyEditorModal = lazy(() => import('./EditorModal/EditorModal'));

export const Home = () => {
  let mouseTimer;

  const onMouseUp = () => mouseTimer && window.clearTimeout(mouseTimer);

  return (
    <div className={css.container} onScroll={onMouseUp}>
      <Sidebar />
      <Suspense>
        <Content mouseTimer={mouseTimer} />
      </Suspense>
      <LazyEditorModal />
    </div>
  );
};
