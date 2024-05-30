import { useDispatch, useSelector } from 'react-redux';
import { setPath } from 'redux/features/app/appSlice';

import { IconButton } from 'components/IconButton/IconButton';
import { Tooltip } from 'components/Tooltip/Tooltip';

import css from './FolderNavigation.module.css';

import { ARROW_BACK } from 'utils/variables';

export const FolderNavigation = ({ name }) => {
  const dispatch = useDispatch();

  const { windowWidth, path } = useSelector(state => state.app);

  const handleBack = () => {
    if (windowWidth <= 480) {
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
    <div data-draggable={true} data-type="navigation" className={css.container}>
      <Tooltip position="bottom" text="Back">
        <IconButton variant="secondary" path={ARROW_BACK} onClick={handleBack} />
      </Tooltip>
      {name}
    </div>
  );
};
