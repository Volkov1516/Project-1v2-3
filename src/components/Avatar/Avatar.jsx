import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import css from './Avatar.module.css';

import avatarLight from 'assets/images/avatarLight.svg';
import avatarDark from 'assets/images/avatarDark.svg';

export const Avatar = ({ src, alt, size, onClick }) => {
  const { theme } = useSelector(state => state.app);

  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    if(src) {
      setImgSrc(src);
    }
    else {
      theme === 'light' ? setImgSrc(avatarLight) : setImgSrc(avatarDark);
    }
  }, [src, theme]);

  const handleError = () => theme === 'light' ? setImgSrc(avatarLight) : setImgSrc(avatarDark);

  const handleTouchStart = e => e.currentTarget.classList.add(css.touch);

  const handleTouchEnd = e => e.currentTarget.classList.remove(css.touch);

  return (
      <img
        className={`${css.img} ${css[size]}`}
        src={imgSrc}
        alt={alt}
        draggable={false}
        onClick={onClick}
        onError={handleError}
        onContextMenu={(e) => e.preventDefault()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      />
  );
};
