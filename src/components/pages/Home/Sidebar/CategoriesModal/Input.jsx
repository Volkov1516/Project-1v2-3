import { useState } from 'react';

import css from './CategoriesModal.module.css';

export const Input = ({ id, name, handleUpdateUserCategory }) => {
  const [inputValue, setInputValue] = useState(null);

  return (
    <input
      className={css.categoryInput}
      value={inputValue !== null ? inputValue : name}
      onChange={(e) => setInputValue(e.target.value)}
      onBlur={() => handleUpdateUserCategory(id, inputValue)}
    />
  );
};
