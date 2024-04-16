import { Bar } from './Bar/Bar';
import { Manager } from './Manager/Manager';
import { EditorModal } from './EditorModal/EditorModal';
import { Snackbar } from 'components/atoms/Snackbar/Snackbar';

import css from './Home.module.css';

export const Home = () => {
  return (
    <div className={css.container}>
      <Bar />
      <Manager />
      <EditorModal />
      <Snackbar />
    </div>
  );
};
