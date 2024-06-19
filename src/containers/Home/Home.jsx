import { Dock } from './Dock/Dock';
import { Vault } from './Vault/Vault';
import { EditorModal } from './EditorModal/EditorModal';
import { Snackbar } from 'components/Snackbar/Snackbar';

import css from './Home.module.css';

export const Home = () => {
  return (
    <div className={css.container}>
      <Dock />
      <Vault />
      <EditorModal />
      <Snackbar />
    </div>
  );
};
