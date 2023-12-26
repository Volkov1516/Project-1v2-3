import {forwardRef} from 'react';
import { useSelector } from 'react-redux';

import css from './Categories.module.css';

export const Categories = forwardRef(function MyCategories(props, ref) {
  const { documentCategories } = useSelector(state => state.document);

  return (
    <div className={css.categoriesContainer} ref={ref}>
      {documentCategories?.map(i => (
        <div key={i?.id} className={css.category}>
          {i?.name}
        </div>
      ))}
    </div>
  );
});
