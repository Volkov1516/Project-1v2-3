import { useState } from 'react';

import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { SET_CURRENT_ID, SET_CURRENT_INDEX, SET_CONTENT } from 'redux/features/article/articleSlice';

import css from './Home.module.css';

import { Header } from 'components/molecules/Header/Header';
import { ModalEditor } from 'components/molecules/ModalEditor/ModalEditor';
import { ModalPreview } from 'components/molecules/ModalPreview/ModalPreview';

export const Home = () => {
  const dispatch = useDispatch();
  const { all, currentIndex } = useSelector(state => state.article);

  let mouseTimer;

  const [titleState, setTitleState] = useState('');
  const [modalEditorStatus, setModalEditorStatus] = useState(false);
  const [modalPreviewStatus, setModalPreviewStatus] = useState(false);
  const [contentType, setContentType] = useState('all articles');

  const openModalEditor = (id, content, title) => {
    setTitleState(title);
    dispatch(SET_CURRENT_ID(id));
    dispatch(SET_CONTENT(content));
    setModalEditorStatus(true);
  };

  const openModalEditorFromPreview = () => {
    setTitleState(all[currentIndex]?.data()?.title);
    dispatch(SET_CURRENT_ID(all[currentIndex]?.id));
    dispatch(SET_CONTENT(all[currentIndex]?.data()?.content));
    setModalEditorStatus(true);
  };

  const onMouseDown = (id, content, title, index) => {
    onMouseUp();

    mouseTimer = window.setTimeout(() => {
      setTitleState(title);
      dispatch(SET_CURRENT_ID(id));
      dispatch(SET_CURRENT_INDEX(index));
      dispatch(SET_CONTENT(content));
      setModalPreviewStatus(true);
    }, 500);
  };

  const onMouseUp = () => mouseTimer && window.clearTimeout(mouseTimer);

  return (
    <div className={css.container} onScroll={onMouseUp}>
      <Header contentType={contentType} setContentType={setContentType} />
      {contentType === 'all articles' && (
        <div className={css.main} onScroll={onMouseUp}>
          {all?.map((i, index) => (
            !i?.data()?.archive && <article
              key={i?.id}
              onClick={() => openModalEditor(i?.id, i?.data()?.content, i?.data()?.title)}
              onMouseDown={() => onMouseDown(i?.id, i?.data()?.content, i?.data()?.title, index)}
              onMouseUp={onMouseUp}
              onTouchStart={() => onMouseDown(i?.id, i?.data()?.content, i?.data()?.title, index)}
              onTouchEnd={onMouseUp}
            >
              {i?.data()?.title || 'Untitled'}
            </article>
          ))}
        </div>
      )}
      {contentType === 'archive' && (
        <div className={css.main} onScroll={onMouseUp}>
          {all?.map((i, index) => (
            i?.data()?.archive && <article
              key={i?.id}
              onClick={() => openModalEditor(i?.id, i?.data()?.content, i?.data()?.title)}
              onMouseDown={() => onMouseDown(i?.id, i?.data()?.content, i?.data()?.title, index)}
              onMouseUp={onMouseUp}
              onTouchStart={() => onMouseDown(i?.id, i?.data()?.content, i?.data()?.title, index)}
              onTouchEnd={onMouseUp}
            >
              {i?.data()?.title || 'Untitled'}
            </article>
          ))}
        </div>
      )}
      <ModalEditor
        modalEditorStatus={modalEditorStatus}
        setModalEditorStatus={setModalEditorStatus}
        titleState={titleState}
        setTitleState={setTitleState}
      />
      <ModalPreview
        modalPreviewStatus={modalPreviewStatus}
        setModalPreviewStatus={setModalPreviewStatus}
        titleState={titleState}
        setTitleState={setTitleState}
        openModalEditorFromPreview={openModalEditorFromPreview}
      />
    </div>
  );
};
