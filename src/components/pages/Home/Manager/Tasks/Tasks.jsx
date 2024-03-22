import { Task } from './Task/Task';

import css from './Tasks.module.css';

export const Tasks = ({ tasks, isDraggable, handleTouchStart, handleTouchEnd, handleTouchMove }) => {
  return (
    <div id="task" className={css.container}>
      {tasks?.map((i, index) => (
        <div
          key={i.id}
          id={i.id}
          data-index={index}
          data-id={i.id}
          data-type="task"
          onTouchStart={e => handleTouchStart(e, index, i.id, "task")}
          onTouchEnd={handleTouchEnd}
          onTouchMove={handleTouchMove}
          onMouseDown={e => handleTouchStart(e, index, i.id, "task")}
          onMouseUp={handleTouchEnd}
          onMouseMove={handleTouchMove}
        >
          <Task id={i?.id} content={i?.content} isDraggable={isDraggable} />
        </div>
      ))}
    </div>
  );
};
