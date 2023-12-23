import { Sidebar } from './Sidebar/Sidebar';
import { Content } from './Content/Content';
import { EditorModal } from './EditorModal/EditorModal';

import css from './Home.module.css';

export const Home = () => {
  let mouseTimer;

  const onMouseUp = () => mouseTimer && window.clearTimeout(mouseTimer);

  return (
    <div id="home" className={css.container} onScroll={onMouseUp}>
      <Sidebar />
      <Content mouseTimer={mouseTimer} />
      <EditorModal />
    </div>
  );
};
