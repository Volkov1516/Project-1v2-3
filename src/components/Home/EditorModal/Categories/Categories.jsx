import React from 'react';
import { useSelector } from 'react-redux';

import css from './Categories.module.css';

export const Categories = () => {
  const { documentCategories } = useSelector(state => state.document);

  return (
    <div className={css.categoriesContainer}>
      {documentCategories?.map(i => (
        <div key={i?.id} className={css.category}>
          {i?.name}
        </div>
      ))}
    </div>
  );
};
