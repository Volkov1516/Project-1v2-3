import { Quote } from './Quote/Quote';

import css from './Widgets.module.css';

export const Widgets = () => {
  return (
    <div className={css.container}>
      <Quote />
    </div>
  );
};
