import React from 'react';
import { useSelector } from 'react-redux';

import { useDragAndDrop } from './DragAndDropContext';

export const DragAdnDropElement = ({ children, index, id, type, name, openSettingsModal }) => {
  const { windowWidth } = useSelector(state => state.app);

  const { dragStart, dragMove, dragEnd } = useDragAndDrop();

  return windowWidth < 639 ? (
    <div
      id={id}
      data-index={index}
      data-id={id}
      data-type={type}
      onTouchStart={(e) => dragStart(e, index, id, type, name, openSettingsModal)}
      onTouchMove={dragMove}
      onTouchEnd={dragEnd}
      style={{ transition: 'transform 0.2s ease-in' }}
    >
      {children}
    </div>
  ) : (
    <div
      id={id}
      data-index={index}
      data-id={id}
      data-type={type}
      onTouchStart={(e) => dragStart(e, index, id, type, name, openSettingsModal)}
      onTouchMove={dragMove}
      onTouchEnd={dragEnd}
      onMouseDown={(e) => dragStart(e, index, id, type, name, openSettingsModal)}
      onMouseMove={dragMove}
      onMouseUp={dragEnd}
    >
      {children}
    </div>
  )
};
