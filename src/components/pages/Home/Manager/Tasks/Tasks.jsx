import { Task } from './Task/Task';

import css from './Tasks.module.css';

export const Tasks = ({ tasks, handleTouchStart, handleTouchEnd, handleTouchMove }) => {
  return (
    <div id="task" className={css.container}>
      {tasks?.map((i, index) => (
        <div
          key={i.id}
          id={i.id}
          data-index={index}
          data-id={i.id}
          data-draggable={true}
          data-type="task"
          onTouchStart={e => handleTouchStart(e, index, i.id, i.content, "task")}
          onTouchEnd={e => handleTouchEnd(e)}
          onTouchMove={e => handleTouchMove(e, index, i.id, i.content, "task")}
          // onMouseDown={e => handleTouchStart(e, index, i.id, i.content, "task")}
          // onMouseUp={e => handleTouchEnd(e)}
          // onMouseMove={e => handleTouchMove(e, index, i.id, i.content, "task")}
        >
          <Task id={i?.id} content={i?.content} />
        </div>
      ))}
    </div>
  );
};
