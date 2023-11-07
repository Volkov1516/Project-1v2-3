import { useEffect, forwardRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setTitle } from 'redux/features/article/articleSlice';

import css from './Title.module.css';

export const Title = forwardRef(function MyTitle(props, ref) {
  const dispatch = useDispatch();
  const { title, color } = useSelector(state => state.article);

  useEffect(() => {
    if (ref?.current) {
      ref.current.style.height = '40px';
      ref.current.style.height = (ref?.current.scrollHeight) + 'px';
    }
  }, [title, ref]);

  const onTitleChange = (e) => dispatch(setTitle(e.target.value));

  const handleEnter = (e) => e.key === 'Enter' && e.preventDefault();

  return (
    <textarea
      ref={ref}
      className={css[color]}
      rows={1}
      spellCheck={false}
      placeholder="Title"
      value={title}
      onChange={onTitleChange}
      onKeyDown={handleEnter}
    />
  );
});
