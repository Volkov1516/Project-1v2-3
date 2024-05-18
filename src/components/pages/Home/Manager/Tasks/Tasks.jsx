import { Task } from './Task/Task';
import { DragAdnDropElement } from 'components/atoms/DragAndDrop/DragAndDropElement';

import css from './Tasks.module.css';

export const Tasks = ({ tasks }) => {
  return (
    <div id="task" className={css.container}>
      {tasks?.map((i, index) => (
        <DragAdnDropElement key={index} index={index} id={i.id} type="task">
          <Task id={i?.id} content={i?.content} />
        </DragAdnDropElement>
      ))}
    </div>
  );
};
