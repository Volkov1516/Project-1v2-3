import { useState, useRef, useEffect } from 'react';

import css from './Title.module.css';

export const Title = () => {
  const titleRef = useRef(null);

  const [titleInputValue, setTitleInputValue] = useState('');

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = '40px';
      titleRef.current.style.height = (titleRef.current.scrollHeight) + 'px';
    }
  }, [titleInputValue]);

  const onTitleChange = (e) => setTitleInputValue(e.target.value);

  const handleEnter = (e) => e.key === 'Enter' && e.preventDefault();

  return (
    <textarea
      ref={titleRef}
      className={css.textarea}
      rows={1}
      spellCheck={false}
      placeholder="Title"
      value={titleInputValue}
      onChange={onTitleChange}
      onKeyDown={handleEnter}
    />
  );
};
