import { useDispatch, useSelector } from 'react-redux';
import { setArticleId, setArticleIndex, setArticleTitle, setArticleContent, setArticleColor, setIsArchived, setArticleCategories } from 'redux/features/article/articleSlice';
import { SET_MODAL_PREVIEW, SET_MODAL_EDITOR_EXISTING, SET_MODAL_AUTOFOCUS } from 'redux/features/modal/modalSlice';

import css from './Content.module.css';

export const Content = ({ mouseTimer }) => {
  const dispatch = useDispatch();
  const { articles, filteredArticlesId } = useSelector(state => state.article);

  const openModalEditor = (id, content, title, index, color, archive, categories) => {
    dispatch(setArticleId(id));
    dispatch(setArticleTitle(title));
    dispatch(setArticleContent(content));
    dispatch(setArticleColor(color));
    dispatch(setArticleCategories(categories));
    dispatch(setIsArchived(archive));
    dispatch(setArticleIndex(index));
    dispatch(SET_MODAL_AUTOFOCUS(false));
    dispatch(SET_MODAL_EDITOR_EXISTING(true));

    window.history.pushState({ modalEditor: 'opened' }, '', '#editor');
  };

  const onMouseDown = (id, content, title, index, color, archive, categories) => {
    onMouseUp();

    mouseTimer = window.setTimeout(() => {
      window.navigator.vibrate(100);

      dispatch(setArticleId(id));
      dispatch(setArticleTitle(title));
      dispatch(setArticleContent(content));
      dispatch(setArticleColor(color));
      dispatch(setArticleCategories(categories));
      dispatch(setIsArchived(archive));
      dispatch(setArticleIndex(index));
      dispatch(SET_MODAL_AUTOFOCUS(false));
      dispatch(SET_MODAL_PREVIEW(true));

      window.history.pushState({ modalPreview: 'opened' }, '', '#preview');
    }, 500);
  };

  const onMouseUp = () => mouseTimer && window.clearTimeout(mouseTimer);

  return (
    <main className={css.main} onScroll={onMouseUp}>
      {articles?.map((i, index) => filteredArticlesId.includes(i.id) && (
        <article
          key={i?.id}
          onClick={() => openModalEditor(i?.id, i?.content, i?.title, index, i?.color, i?.archive, i?.categories)}
          onMouseDown={() => onMouseDown(i?.id, i?.content, i?.title, index, i?.color, i?.archive, i?.categories)}
          onMouseUp={onMouseUp}
          onTouchStart={() => onMouseDown(i?.id, i?.content, i?.title, index, i?.color, i?.archive, i?.categories)}
          onTouchEnd={onMouseUp}
          className={css[i?.color]}
        >
          {i?.title || 'Untitled'}
        </article>
      ))}
    </main>
  );
};
