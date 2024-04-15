import { useSelector } from 'react-redux';

import { Bar } from './Bar/Bar';
import { Manager } from './Manager/Manager';
import { EditorModal } from './EditorModal/EditorModal';
import { Snackbar } from 'components/atoms/Snackbar/Snackbar';

import css from './Home.module.css';

export const Home = () => {
  const { appPathname } = useSelector(state => state.app);

  return (
    <div className={css.container}>
      <Bar />
      <Manager />
      {appPathname?.includes('note') && <EditorModal />}
      <Snackbar />
    </div>
  );
};
