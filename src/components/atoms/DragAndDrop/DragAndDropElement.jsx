import React from 'react';
import { useDragAndDrop } from './DragAndDropContext';

export const DragAdnDropElement = ({ children, index, id, type, name, openSettingsModal }) => {
  const { dragStart, dragMove, dragEnd } = useDragAndDrop();

  return (
    <div
      id={id}
      data-index={index}
      data-id={id}
      data-type={type}
      onMouseDown={(e) => dragStart(e, index, id, type, name, openSettingsModal)}
      onMouseMove={dragMove}
      onMouseUp={dragEnd}
      onTouchStart={(e) => dragStart(e, index, id, type, name, openSettingsModal)}
      onTouchMove={dragMove}
      onTouchEnd={dragEnd}
      // style={{ transition: 'transform 0.2s ease-in' }}
    >
      {children}
    </div>
  );
};
