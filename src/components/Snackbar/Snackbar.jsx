import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setSnackbar } from 'redux/features/app/appSlice';

import { IconButton } from '../IconButton/IconButton';

import css from './Snackbar.module.css';

import { CLOSE } from 'utils/variables';

export const Snackbar = () => {
  const dispatch = useDispatch();

  const { snackbar } = useSelector(state => state.app);

  useEffect(() => {
    let timeout = setTimeout(() => dispatch(setSnackbar(null)), 3000);

    return () => clearTimeout(timeout);
  }, [snackbar, dispatch]);

  const handleClose = () => {
    dispatch(setSnackbar(false));
  }

  return snackbar && createPortal(
    <div className={css.container}>
      {snackbar}
      <IconButton variant="secondary" path={CLOSE} onClick={handleClose}  />
    </div>,
    document.body
  );
};
