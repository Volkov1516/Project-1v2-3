import { useState } from 'react';

import css from './DragAndDrop.module.css';

export const DragAndDrop = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [elements, setElements] = useState(['red', 'blue'])
  const [draggableElementId, setDraggableElementId] = useState(null);
  const [targetElementId, setTargetElementId] = useState(null);

  const handleOnPointerDown = (e) => {
    setIsDragging(true);
    setDraggableElementId(e.target.id);
  };

  const handleOnPointerMove = (e) => {
    e.preventDefault();

    if (!isDragging) return;

    const container = document.getElementById('container');
    const draggable = document.getElementById(draggableElementId);

    const elementBelow = document?.elementFromPoint(e.clientX, e.clientY);
    console.log(elementBelow?.id);

    setTargetElementId(elementBelow?.id);

    // draggable.style.position = 'absolute';
    draggable.style.opacity = 0.3;
    draggable.style.zIndex = -0;

    const x = e.clientX - container.getBoundingClientRect().left - draggable.clientWidth / 2;
    const y = e.clientY - container.getBoundingClientRect().top - draggable.clientHeight / 2;
    draggable.style.left = `${Math.min(Math.max(x, 0), container.clientWidth - draggable.clientWidth)}px`;
    draggable.style.top = `${Math.min(Math.max(y, 0), container.clientHeight - draggable.clientHeight)}px`;
  };

  const handleOnPointerUp = (e) => {
    setIsDragging(false);

    const draggable = document.getElementById(draggableElementId);
    draggable.style.position = 'block';
    draggable.style.opacity = 1;
    draggable.style.zIndex = 1;

  };

  const handleOnPointerLeave = () => {
    setIsDragging(false);

    const draggable = document.getElementById(draggableElementId);
    draggable.style.position = 'block';
    draggable.style.opacity = 1;
  };

  const handlePointerUp = () => {
    if (targetElementId === 'blue') {
      setElements(['blue', 'red']);
    }
    else {
      setElements(['red', 'blue']);
    }
  };

  return (
    <div id="container" className={css.container} onPointerMove={handleOnPointerMove} onPointerUp={handleOnPointerUp} onPointerLeave={handleOnPointerLeave}>
      {elements?.map((i, index) => <div key={index} id={i} className={css[i]} onPointerDown={handleOnPointerDown} onPointerUp={handlePointerUp} />)}
    </div>
  );
};
