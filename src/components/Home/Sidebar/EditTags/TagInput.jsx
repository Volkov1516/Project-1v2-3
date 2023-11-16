import { useState } from 'react';

import css from './EditTags.module.css';

export const TagInput = ({ id, name, handleUpdateCategory }) => {
  const [inputValue, setInputValue] = useState(null);

  return (
    <div className={css.editTagsContainer}>
      <input
        className={css.categoryInput}
        value={inputValue !== null ? inputValue : name}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={() => handleUpdateCategory(id, inputValue)}
      />
    </div>
  );
};