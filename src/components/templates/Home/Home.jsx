import { useDispatch, useSelector } from 'react-redux';
import { SET_CURRENT_ID, SET_CURRENT_INDEX, SET_TITLE, SET_CONTENT } from 'redux/features/article/articleSlice';
import { SET_MODAL_PREVIEW, SET_MODAL_EDITOR_EXISTING } from 'redux/features/modal/modalSlice';

import css from './Home.module.css';

import { Header } from 'components/molecules/Header/Header';
import { ModalEditor } from 'components/molecules/ModalEditor/ModalEditor';
import { ModalPreview } from 'components/molecules/ModalPreview/ModalPreview';

export const Home = () => {
  const dispatch = useDispatch();
  const { filteredArticles, currentIndex } = useSelector(state => state.article);
  const { modalEditorExisting } = useSelector(state => state.modal);

  let mouseTimer;

  const openModalEditor = (id, content, title, index) => {
    window.history.pushState({modalEditor: 'opened'}, '', '#editor');

    dispatch(SET_CURRENT_INDEX(index));
    dispatch(SET_TITLE(title));
    dispatch(SET_CURRENT_ID(id));
    dispatch(SET_CONTENT(content));
    dispatch(SET_MODAL_EDITOR_EXISTING(true));
  };

  const openModalEditorFromPreview = () => {
    window.history.pushState({modalEditor: 'opened'}, '', '#editor');

    dispatch(SET_TITLE(filteredArticles[currentIndex]?.data()?.title));
    dispatch(SET_CURRENT_ID(filteredArticles[currentIndex]?.id));
    dispatch(SET_CONTENT(filteredArticles[currentIndex]?.data()?.content));
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
    <div className={css.container} onScroll={onMouseUp}>
      <Header />
      <div className={css.main} onScroll={onMouseUp}>
        {filteredArticles?.map((i, index) => (
          <article
            key={i?.id}
            onClick={() => openModalEditor(i?.id, i?.data()?.content, i?.data()?.title, index)}
            onMouseDown={() => onMouseDown(i?.id, i?.data()?.content, i?.data()?.title, index)}
            onMouseUp={onMouseUp}
            onTouchStart={() => onMouseDown(i?.id, i?.data()?.content, i?.data()?.title, index)}
            onTouchEnd={onMouseUp}
            className={css[i?.data()?.color]}
          >
            {i?.data()?.title || 'Untitled'}
          </article>
        ))}
      </div>
      <ModalEditor
        modalEditorStatus={modalEditorExisting}
        setModalEditorStatus={() => dispatch(SET_MODAL_EDITOR_EXISTING(false))}
        autofocus={false}
      />
      <ModalPreview openModalEditorFromPreview={openModalEditorFromPreview} />
    </div>
  );
};
