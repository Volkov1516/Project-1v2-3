import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setSnackbar } from 'redux/features/app/appSlice';

import { IconButton } from '../IconButton/IconButton';

import css from './Snackbar.module.css';

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
      <IconButton snack onClick={handleClose} path="M256-227.692 227.692-256l224-224-224-224L256-732.308l224 224 224-224L732.308-704l-224 224 224 224L704-227.692l-224-224-224 224Z" />
    </div>,
    document.body
  );
};
