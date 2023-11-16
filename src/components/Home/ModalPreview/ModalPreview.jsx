import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SET_MODAL_EDITOR_EXISTING, SET_MODAL_AUTOFOCUS, SET_MODAL_SCROLL } from 'redux/features/modal/modalSlice';
import { incrementIndex, decrementIndex } from 'redux/features/article/articleSlice';
import { SET_MODAL_PREVIEW } from 'redux/features/modal/modalSlice';
import { Editor } from 'components/Home/Editor/Editor';
import css from './ModalPreview.module.css';
import { ModalArticleSettings } from '../ModalArticleSettings/ModalArticleSettings';

export const ModalPreview = () => {
  const dispatch = useDispatch();
  const { tags } = useSelector(state => state.user);
  const { articleTags, filteredArticlesId, articleIndex, title, color, date } = useSelector(state => state.article);
  const { scrollOffset } = useSelector(state => state.modal);

  let newDate = new Date();

  useEffect(() => {
    const modalPreviewElement = document?.getElementById('modalPreview');
    modalPreviewElement?.scrollTo({ top: scrollOffset, behavior: 'smooth' });
  }, [scrollOffset]);

  const openModalEditorFromPreview = () => {
    window.history.pushState({ modalEditor: 'opened' }, '', '#editor');

    const modalPreviewElement = document.getElementById('modalPreview');
    dispatch(SET_MODAL_SCROLL(modalPreviewElement.scrollTop));
    dispatch(SET_MODAL_AUTOFOCUS(false));
    dispatch(SET_MODAL_EDITOR_EXISTING(true));
  };

  const prev = () => {
    if (articleIndex === 0) return;

    const modalPreviewElement = document.getElementById('modalPreview');
    modalPreviewElement.scrollTo({ top: 0, behavior: 'smooth' });
    dispatch(decrementIndex());
  };

  const next = () => {
    if (articleIndex === filteredArticlesId?.length - 1) return;

    const modalPreviewElement = document.getElementById('modalPreview');
    modalPreviewElement.scrollTo({ top: 0, behavior: 'smooth' });
    dispatch(incrementIndex());
  };

  const close = () => {
    window.history.back();
    dispatch(SET_MODAL_PREVIEW(false));
  };

  return (
    <div className={css.container} onClick={close}>
      <div className={css.content} onClick={(e) => e.stopPropagation()}>
        <div className={css.header}>
          <div className={css.left}>
            <div className={css.navigation}>
              <button className={css.navigationBtn} onClick={prev}>prev</button>
              <button className={css.navigationBtn} onClick={next}>next</button>
            </div>
            <button className={css.editBtn} onClick={openModalEditorFromPreview}>edit</button>
            <ModalArticleSettings />
          </div>
          <div className={css.right}>
            <button className={css.closeBtn} style={{color: "black"}} onClick={close}>close</button>
          </div>
        </div>
        <div id="modalPreview" className={css.editor}>
          <div className={`${css.title} ${css[color]}`}>{title || "Untitled"}</div>
          <Editor preview={true} />
          <div className={css.metadata}>
            <div className={css.date}>
              {date || newDate.toLocaleDateString()}
            </div>
            {tags?.map(i => articleTags?.map(j => {
              return i.id === j.id && <div key={i.id} className={css.category} style={{ color: "#1971c2" }}>#{i?.name}</div>
            }))}
          </div>
        </div>
      </div>
    </div>
  );
};