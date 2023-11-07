import { useDispatch, useSelector } from 'react-redux';
import { setCurrentId, setCurrentIndex, setTitle, setContent, setColor } from 'redux/features/article/articleSlice';
import { SET_MODAL_PREVIEW, SET_MODAL_EDITOR_EXISTING, SET_MODAL_AUTOFOCUS } from 'redux/features/modal/modalSlice';

import css from './Content.module.css';

export const Content = ({ mouseTimer }) => {
  const dispatch = useDispatch();
  const { articles, filteredArticlesId } = useSelector(state => state.article);

  const openModalEditor = (id, content, title, index, color) => {
    window.history.pushState({ modalEditor: 'opened' }, '', '#editor');

    dispatch(setCurrentIndex(index));
    dispatch(setTitle(title));
    dispatch(setColor(color));
    dispatch(setCurrentId(id));
    dispatch(setContent(content));
    dispatch(SET_MODAL_AUTOFOCUS(false));
    dispatch(SET_MODAL_EDITOR_EXISTING(true));
  };

  const onMouseDown = (id, content, title, index, color) => {
    onMouseUp();

    mouseTimer = window.setTimeout(() => {
      window.navigator.vibrate(100);
      window.history.pushState({ modalPreview: 'opened' }, '', '#preview');

      dispatch(setTitle(title));
      dispatch(setColor(color));
      dispatch(setCurrentId(id));
      dispatch(setCurrentIndex(index));
      dispatch(setContent(content));
      dispatch(SET_MODAL_PREVIEW(true));
    }, 500);
  };

  const onMouseUp = () => mouseTimer && window.clearTimeout(mouseTimer);

  return (
    <div className={css.main} onScroll={onMouseUp}>
      {articles?.map((i, index) => filteredArticlesId.includes(i.id) && (
        <article
          key={i?.id}
          onClick={() => openModalEditor(i?.id, i?.content, i?.title, index, i?.color)}
          onMouseDown={() => onMouseDown(i?.id, i?.content, i?.title, index, i?.color)}
          onMouseUp={onMouseUp}
          onTouchStart={() => onMouseDown(i?.id, i?.content, i?.title, index, i?.color)}
          onTouchEnd={onMouseUp}
          className={css[i?.color]}
        >
          {i?.title || 'Untitled'}
        </article>
      ))}
    </div>
  );
};
