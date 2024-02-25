import { useDispatch, useSelector } from 'react-redux';
import { updatePath } from 'redux/features/user/userSlice';

import { IconButton } from 'components/atoms/IconButton/IconButton';

import css from './FolderNavigation.module.css';

export const FolderNavigation = ({ text }) => {
  const dispatch = useDispatch();
  const { path } = useSelector(state => state.user);

  const handleBack = () => {
    let newArr = JSON.parse(JSON.stringify(path));
    newArr.pop();

    dispatch(updatePath([...newArr]));
  };

  if (!text) return null;

  return (
    <div className={css.container}>
      <IconButton onClick={handleBack} path="m276.846-460 231.693 231.692L480-200 200-480l280-280 28.539 28.308L276.846-500H760v40H276.846Z" />
      {text}
    </div>
  );
};