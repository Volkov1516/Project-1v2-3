import { useState, useEffect } from 'react';

import css from './Avatar.module.css';

import avatar from 'assets/images/avatar.svg';

export const Avatar = ({ src, alt, size, onClick }) => {
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  const handleError = () => setImgSrc(avatar);

  return (
    <img
      className={`${css.img} ${css[size]}`}
      src={imgSrc}
      alt={alt}
      draggable={false}
      onClick={onClick}
      onError={handleError}
      onContextMenu={(e) => e.preventDefault()}
    />
  );
};
