import { useState } from 'react';

import Button from 'components/atoms/Button/Button';

import css from './ModalCategory.module.css';
import { Input } from 'components/atoms/Input/Input';

export const ModalCategory = () => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  return (
    <>
      <div className={css.dropdownItem} onClick={() => setOpen(true)}>edit categories</div>
      {open && (
        <div className={css.container} onClick={() => setOpen(false)}>
          <div className={css.content} onClick={(e) => e.stopPropagation()}>
            <div className={css.header}>
            <Button variant="text" onClick={() => setOpen(false)}>close</Button>
            </div>
            <div className={css.inputContainer}>
              <Input variant="contained" placeholder="New category" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
              <Button variant="contained">add</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
