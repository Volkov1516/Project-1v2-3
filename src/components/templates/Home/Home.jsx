import { useState } from 'react';

import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { SET_CURRENT_ID, SET_CURRENT_INDEX, SET_TITLE, SET_CONTENT } from 'redux/features/article/articleSlice';

import css from './Home.module.css';

import { Header } from 'components/molecules/Header/Header';
import { ModalEditor } from 'components/molecules/ModalEditor/ModalEditor';
import { ModalPreview } from 'components/molecules/ModalPreview/ModalPreview';

export const Home = () => {
  const dispatch = useDispatch();
  const { filteredArticles, currentIndex } = useSelector(state => state.article);

  let mouseTimer;

  const [modalEditorStatus, setModalEditorStatus] = useState(false);
  const [modalPreviewStatus, setModalPreviewStatus] = useState(false);

  const openModalEditor = (id, content, title, index) => {
    dispatch(SET_CURRENT_INDEX(index));
    dispatch(SET_TITLE(title));
    dispatch(SET_CURRENT_ID(id));
    dispatch(SET_CONTENT(content));
    setModalEditorStatus(true);
  };

  const openModalEditorFromPreview = () => {
    dispatch(SET_TITLE(filteredArticles[currentIndex]?.data()?.title));
    dispatch(SET_CURRENT_ID(filteredArticles[currentIndex]?.id));
    dispatch(SET_CONTENT(filteredArticles[currentIndex]?.data()?.content));
    setModalEditorStatus(true);
  };

  const onMouseDown = (id, content, title, index) => {
    onMouseUp();

    mouseTimer = window.setTimeout(() => {
      dispatch(SET_TITLE(title));
      dispatch(SET_CURRENT_ID(id));
      dispatch(SET_CURRENT_INDEX(index));
      dispatch(SET_CONTENT(content));
      setModalPreviewStatus(true);
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
        modalEditorStatus={modalEditorStatus}
        setModalEditorStatus={setModalEditorStatus}
      />
      <ModalPreview
        modalPreviewStatus={modalPreviewStatus}
        setModalPreviewStatus={setModalPreviewStatus}
        openModalEditorFromPreview={openModalEditorFromPreview}
      />
    </div>
  );
};
