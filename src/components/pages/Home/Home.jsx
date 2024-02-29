import { Bar } from './Bar/Bar';
import { Content } from './Content/Content';
import { EditorModal } from './EditorModal/EditorModal';
import { Snackbar } from 'components/atoms/Snackbar/Snackbar';

import css from './Home.module.css';

export const Home = () => {
  let mouseTimer;

  const onMouseUp = () => mouseTimer && window.clearTimeout(mouseTimer);

  return (
    <div className={css.container} onScroll={onMouseUp}>
      <Bar />
      <Content mouseTimer={mouseTimer} />
      <EditorModal />
      <Snackbar />
    </div>
  );
};
