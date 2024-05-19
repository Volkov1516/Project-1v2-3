import { useDispatch, useSelector } from 'react-redux';
import { setPath } from 'redux/features/app/appSlice';

import { IconButton } from 'components/IconButton/IconButton';

import css from './FolderNavigation.module.css';

import { ARROW_BACK } from 'utils/variables';

export const FolderNavigation = ({ name }) => {
  const dispatch = useDispatch();

  const { windowWidth, path } = useSelector(state => state.app);

  const handleBack = (e) => {
    e.stopPropagation();

    if (windowWidth < 639) {
      window.history.back();
    }
    else {
      let newPath = JSON.parse(JSON.stringify(path));
      newPath.pop();
      dispatch(setPath([...newPath]));
    }
  };

  if (!name) return null;

  return (
    <div data-draggable={true} data-type="navigation" className={css.container} onPointerDown={e => e.stopPropagation()}>
      <IconButton onClick={handleBack} path={ARROW_BACK} />
      {name}
    </div>
  );
};