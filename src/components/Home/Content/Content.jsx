import { useDispatch, useSelector } from 'react-redux';
import { setArticleId, setArticleIndex, setArticleTitle, setArticleContent, setArticleColor, setIsArchived, setArticleTags } from 'redux/features/article/articleSlice';
import { setEditorModalStatus } from 'redux/features/modal/modalSlice';

import css from './Content.module.css';

export const Content = ({ mouseTimer }) => {
  const dispatch = useDispatch();
  const { articles, filteredArticlesId } = useSelector(state => state.article);

  const openModalEditor = (id, content, title, index, color, archive, tags) => {
    dispatch(setArticleId(id));
    dispatch(setArticleTitle(title));
    dispatch(setArticleContent(content));
    dispatch(setArticleColor(color));
    dispatch(setArticleTags(tags));
    dispatch(setIsArchived(archive));
    dispatch(setArticleIndex(index));
    dispatch(setEditorModalStatus('editFC'));

    window.history.pushState({}, '', '#editor');
  };

  const onMouseDown = (id, content, title, index, color, archive, tags) => {
    onMouseUp();

    mouseTimer = window.setTimeout(() => {
      window.navigator.vibrate(100);

      dispatch(setArticleId(id));
      dispatch(setArticleTitle(title));
      dispatch(setArticleContent(content));
      dispatch(setArticleColor(color));
      dispatch(setArticleTags(tags));
      dispatch(setIsArchived(archive));
      dispatch(setArticleIndex(index));
      dispatch(setEditorModalStatus('preview'));

      window.history.pushState({}, '', '#preview');
    }, 500);
  };

  const onMouseUp = () => mouseTimer && window.clearTimeout(mouseTimer);

  return (
    <main className={css.main} onScroll={onMouseUp}>
      {articles?.map((i, index) => filteredArticlesId.includes(i.id) && (
        <article
          key={i?.id}
          onClick={() => openModalEditor(i?.id, i?.content, i?.title, index, i?.color, i?.archive, i?.tags)}
          onMouseDown={() => onMouseDown(i?.id, i?.content, i?.title, index, i?.color, i?.archive, i?.tags)}
          onMouseUp={onMouseUp}
          onTouchStart={() => onMouseDown(i?.id, i?.content, i?.title, index, i?.color, i?.archive, i?.tags)}
          onTouchEnd={onMouseUp}
          className={css[i?.color]}
        >
          {i?.title || 'Untitled'}
        </article>
      ))}
    </main>
  );
};
