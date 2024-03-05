import { useState, useRef } from 'react';

import css from './DragAndDrop.module.css';

export const DragAndDrop = () => {
  const containerRef = useRef(null);
  const squareRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);
  const [offsetX, setClietnX] = useState(null);
  const [offsetY, setClietnY] = useState(null);

  const handleOnPointerDown = (e) => {
    setIsDragging(true);
    setClietnX(e.clientX - squareRef.current.getBoundingClientRect().left);
    setClietnY(e.clientY - squareRef.current.getBoundingClientRect().top);
  };

  const handleOnPointerMove = (e) => {
    if (!isDragging) return;
    const x = e.clientX - containerRef.current.getBoundingClientRect().left - offsetX;
    const y = e.clientY - containerRef.current.getBoundingClientRect().top - offsetY;
    squareRef.current.style.left = `${Math.min(Math.max(x, 0), containerRef.current.clientWidth - squareRef.current.clientWidth)}px`;
    squareRef.current.style.top = `${Math.min(Math.max(y, 0), containerRef.current.clientHeight - squareRef.current.clientHeight)}px`;
  };

  const handleOnPointerUp = (e) => {
    setIsDragging(false);
  };

  const handleOnPointerLeave = () => {
    setIsDragging(false);
  };

  return (
    <div ref={containerRef} className={css.container} onPointerMove={handleOnPointerMove} onPointerUp={handleOnPointerUp} onPointerLeave={handleOnPointerLeave}>
      <div ref={squareRef} className={css.red} onPointerDown={handleOnPointerDown}></div>
    </div>
  );
};
