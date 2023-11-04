import { useDispatch, useSelector } from 'react-redux';
import { SET_CURRENT_ID, SET_CURRENT_INDEX, SET_TITLE, SET_CONTENT } from 'redux/features/article/articleSlice';
import { SET_MODAL_PREVIEW, SET_MODAL_EDITOR_EXISTING } from 'redux/features/modal/modalSlice';

import css from './Content.module.css';

export const Content = ({ mouseTimer }) => {
  const dispatch = useDispatch();
  const { filteredArticles } = useSelector(state => state.article);

  const openModalEditor = (id, content, title, index) => {
    window.history.pushState({ modalEditor: 'opened' }, '', '#editor');

    dispatch(SET_CURRENT_INDEX(index));
    dispatch(SET_TITLE(title));
    dispatch(SET_CURRENT_ID(id));
    dispatch(SET_CONTENT(content));
    dispatch(SET_MODAL_EDITOR_EXISTING(true));
  };

  const onMouseDown = (id, content, title, index) => {
    onMouseUp();

    mouseTimer = window.setTimeout(() => {
      window.history.pushState({ modalPreview: 'opened' }, '', '#preview');

      dispatch(SET_TITLE(title));
      dispatch(SET_CURRENT_ID(id));
      dispatch(SET_CURRENT_INDEX(index));
      dispatch(SET_CONTENT(content));
      dispatch(SET_MODAL_PREVIEW(true));
    }, 500);
  };

  const onMouseUp = () => mouseTimer && window.clearTimeout(mouseTimer);

  return (
    <div className={css.main} onScroll={onMouseUp}>
      {filteredArticles?.map((i, index) => (
        <article
          key={i?.id}
          onClick={() => openModalEditor(i?.id, i?.content, i?.title, index)}
          onMouseDown={() => onMouseDown(i?.id, i?.content, i?.title, index)}
          onMouseUp={onMouseUp}
          onTouchStart={() => onMouseDown(i?.id, i?.content, i?.title, index)}
          onTouchEnd={onMouseUp}
          className={css[i?.color]}
        >
          <mark className={css[i?.color]}>{i?.title || 'Untitled'}</mark>
        </article>
      ))}
    </div>
  );
};
