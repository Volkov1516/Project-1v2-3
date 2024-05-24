import React from 'react';

import css from './Avatar.module.css';

export const Avatar = ({ src, alt, size, onClick }) => {
  return (
    <img className={`${css.img} ${css[size]}`} src={src} alt={alt} onClick={onClick} />
  );
};
