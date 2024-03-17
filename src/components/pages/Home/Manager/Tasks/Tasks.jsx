import { Task } from './Task/Task';

import css from './Tasks.module.css';

export const Tasks = ({ tasks }) => {
  return (
    <div className={css.container}>
      {tasks?.map(i => <Task key={i?.id} id={i?.id} content={i?.content} />)}
    </div>
  );
};
