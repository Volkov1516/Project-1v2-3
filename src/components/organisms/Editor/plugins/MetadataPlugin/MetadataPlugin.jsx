import { useSelector } from 'react-redux';

import css from './MetadataPlugin.module.css';

export const MetadataPlugin = () => {
  const { filteredArticles, currentIndex } = useSelector(state => state.article);

  let date = new Date();

  return (
    <div className={css.container}>
      <div className={css.date}>
        {filteredArticles[currentIndex]?.data()?.date?.toDate().toLocaleDateString() || date.toLocaleDateString()}
      </div>
      <div className={css.color}>color</div>
      <div className={css.category}>category</div>
    </div>
  );
};
