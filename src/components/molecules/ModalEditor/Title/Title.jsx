import { useState, useEffect, forwardRef } from 'react';

import css from './Title.module.css';

export const Title = forwardRef(function MyTitle(props, ref) {
  const { setTitleState, titleState } = props;

  const [titleInputValue, setTitleInputValue] = useState(titleState);

  useEffect(() => {
    if (ref?.current) {
      ref.current.style.height = '40px';
      ref.current.style.height = (ref?.current.scrollHeight) + 'px';
    }
  }, [titleInputValue, ref]);

  const onTitleChange = (e) => {
    setTitleInputValue(e.target.value);
    setTitleState(e.target.value);
  };

  const handleEnter = (e) => e.key === 'Enter' && e.preventDefault();

  return (
    <textarea
      ref={ref}
      className={css.textarea}
      rows={1}
      spellCheck={false}
      placeholder="Title"
      value={titleInputValue}
      onChange={onTitleChange}
      onKeyDown={handleEnter}
    />
  );
});
