import { Dock } from './Dock/Dock';
import { Manager } from './Manager/Manager';
import { EditorModal } from './EditorModal/EditorModal';
import { Snackbar } from 'components/Snackbar/Snackbar';

import css from './Home.module.css';

export const Home = () => {
  return (
    <div className={css.container}>
      <Dock />
      <Manager />
      <EditorModal />
      <Snackbar />
    </div>
  );
};
