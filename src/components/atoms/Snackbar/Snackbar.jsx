import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

import { IconButton } from '../IconButton/IconButton';

import css from './Snackbar.module.css';

export const Snackbar = ({ message }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (message) {
      setIsOpen(true);

      let timeout = setTimeout(() => setIsOpen(false), 3000);

      return () => clearTimeout(timeout);
    }
  }, [message]);

  const handleClose = () => {
    setIsOpen(false);
  }

  return isOpen && createPortal(
    <div className={css.container}>
      {message}
      <IconButton snack onClick={handleClose} path="M256-227.692 227.692-256l224-224-224-224L256-732.308l224 224 224-224L732.308-704l-224 224 224 224L704-227.692l-224-224-224 224Z" />
    </div>,
    document.body
  );
};
