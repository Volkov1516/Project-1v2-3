import { useState } from 'react';

import css from './EditCategoriesModal.module.css';

export const Input = ({ id, name, handleUpdateCategory }) => {
  const [inputValue, setInputValue] = useState(null);

  return (
    <input
      className={css.categoryInput}
      value={inputValue !== null ? inputValue : name}
      onChange={(e) => setInputValue(e.target.value)}
      onBlur={() => handleUpdateCategory(id, inputValue)}
    />
  );
};
