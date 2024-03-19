import { useDispatch, useSelector } from 'react-redux';
import { updatePath } from 'redux/features/user/userSlice';

import { IconButton } from 'components/atoms/IconButton/IconButton';

import css from './FolderNavigation.module.css';

export const FolderNavigation = ({ name }) => {
  const dispatch = useDispatch();

  const { path } = useSelector(state => state.user);

  const handleBack = (e) => {
    e.stopPropagation();
    let newArr = JSON.parse(JSON.stringify(path));
    newArr.pop();

    dispatch(updatePath([...newArr]));
  };

  if (!name) return null;

  return (
    <div data-draggable={true} data-type="navigation" className={css.container} onPointerDown={e => e.stopPropagation()}>
      <IconButton onClick={handleBack} path="m276.846-460 231.693 231.692L480-200 200-480l280-280 28.539 28.308L276.846-500H760v40H276.846Z" />
      {name}
    </div>
  );
};
