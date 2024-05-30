import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import css from './Tooltip.module.css';

export const Tooltip = ({ children, text, position }) => {
  const { windowWidth } = useSelector(state => state.app);

  const bubbleRef = useRef(null);

  const [timer, setTimer] = useState(null);

  const handleMouseEnter = () => {
    if (windowWidth > 480) {
      const enter = setTimeout(() => {
        try {
          bubbleRef.current.style.display = 'block';
        } catch (error) {
          console.error(error);
        }
      }, 1000);
      setTimer(enter);
    }
  };

  const handleMouseLeave = () => {
    clearTimeout(timer);
    bubbleRef.current.style.display = 'none';
  };

  return (
    <div
      className={css.container}
      onClick={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span ref={bubbleRef} className={`${css.bubble} ${css[position]}`}>
        {text}
      </span>
      {children}
    </div>
  );
};
