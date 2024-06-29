import { useSelector } from 'react-redux';

import { Dock } from './Dock/Dock';
import { Vault } from './Vault/Vault';
import { Widgets } from './Widgets/Widgets';
import { Editor } from './Editor/Editor';
import { Snackbar } from 'components';

import css from './Home.module.css';

export const Home = () => {
  const { windowWidth } = useSelector(state => state.app);

  return (
    <div className={css.container}>
      <Dock />
      <Vault />
      {windowWidth > 480 && <Widgets />}
      <Editor />
      <Snackbar />
    </div>
  );
};
