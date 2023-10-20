import { useState } from 'react';

import css from './ModalCategory.module.css';

export const CategoryInput = ({ id, name, handleUpdateCategory }) => {
  const [inputValue, setInputValue] = useState(null);

  return (
    <div className={css.editCategoriesContainer}>
      <input
        className={css.categoryInput}
        value={inputValue !== null ? inputValue : name}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={() => handleUpdateCategory(id, inputValue)}
      />
    </div>
  );
};