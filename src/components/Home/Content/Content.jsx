import { useDispatch, useSelector } from 'react-redux';
import { setArticleId, setArticleIndex, setArticleTitle, setArticleContent, setArticleColor, setIsArchived, setArticleCategories } from 'redux/features/article/articleSlice';
import { setEditorModalStatus } from 'redux/features/modal/modalSlice';

import css from './Content.module.css';

export const Content = ({ mouseTimer }) => {
  const dispatch = useDispatch();
  const { articles, filteredArticlesId } = useSelector(state => state.article);
  const { stripedList } = useSelector(state => state.user);

  const openModalEditor = (id, title, content, color, categories, archive) => {

    for (const [index, value] of filteredArticlesId?.entries()) {
      if (id === value) {
        dispatch(setArticleIndex(index));
      }
    }

    dispatch(setArticleId(id));
    dispatch(setArticleTitle(title));
    dispatch(setArticleContent(content));
    dispatch(setArticleColor(color));
    dispatch(setArticleCategories(categories));
    dispatch(setIsArchived(archive));
    dispatch(setEditorModalStatus('editFC'));

    window.history.pushState({}, '', '#editor');
  };

  const onMouseDown = (id, title, content, color, categories, archive) => {
    onMouseUp();

    mouseTimer = window.setTimeout(() => {
      window.navigator.vibrate(100);

      for (const [index, value] of filteredArticlesId?.entries()) {
        if (id === value) {
          dispatch(setArticleIndex(index));
        }
      }

      dispatch(setArticleId(id));
      dispatch(setArticleTitle(title));
      dispatch(setArticleContent(content));
      dispatch(setArticleColor(color));
      dispatch(setArticleCategories(categories));
      dispatch(setIsArchived(archive));
      dispatch(setEditorModalStatus('preview'));

      window.history.pushState({}, '', '#preview');
    }, 500);
  };

  const onMouseUp = () => mouseTimer && window.clearTimeout(mouseTimer);

  return (
    <main className={css.container} onScroll={onMouseUp}>
      {articles?.map((i) => filteredArticlesId.includes(i.id) && (
        <article
          key={i?.id}
          onClick={() => openModalEditor(i?.id, i?.title, i?.content, i?.color, i?.categories, i?.archive)}
          onMouseDown={() => onMouseDown(i?.id, i?.title, i?.content, i?.color, i?.categories, i?.archive)}
          onMouseUp={onMouseUp}
          onTouchStart={() => onMouseDown(i?.id, i?.title, i?.content, i?.color, i?.categories, i?.archive)}
          onTouchEnd={onMouseUp}
          className={`${css[i?.color]} ${stripedList && css.stripedList}`}
        >
          {i?.title || 'Untitled'}
        </article>
      ))}
      {filteredArticlesId?.length < 1 && (
        <div className={css.emptyContainer}>
          no articles
        </div>
      )}
    </main>
  );
};
