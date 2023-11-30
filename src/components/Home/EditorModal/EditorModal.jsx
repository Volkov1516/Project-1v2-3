import React, { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setEditorModalStatus } from 'redux/features/modal/modalSlice';
import { incrementIndex, decrementIndex } from 'redux/features/article/articleSlice';

import css from './EditorModal.module.css';
import { ModalArticleSettings } from './ModalArticleSettings/ModalArticleSettings';
import { Editor } from './Editor/Editor';
import { Title } from './Title/Title';

export const EditorModal = () => {
  const dispatch = useDispatch();
  const { editorModalStatus } = useSelector(state => state.modal);
  const { filteredArticlesId, articleIndex } = useSelector(state => state.article);

  const editorRef = useRef(null);
  const titleRef = useRef(null);

  const close = () => {
    switch (editorModalStatus) {
      case 'edit':
        dispatch(setEditorModalStatus(false));
        window.history.pushState({}, '', '/');
        break;
      case 'editFC':
        dispatch(setEditorModalStatus(false));
        window.history.pushState({}, '', '/');
        break;
      case 'editFP':
        dispatch(setEditorModalStatus('preview'));
        window.history.pushState({}, '', '#preview');
        break;
      case 'preview':
        dispatch(setEditorModalStatus(false));
        window.history.pushState({}, '', '/');
        break;
    }
  };

  const prev = () => {
    if (articleIndex === 0) return;

    const modalPreviewElement = document.getElementById('editorModal');
    modalPreviewElement.scrollTo({ top: 0, behavior: 'instant' });
    dispatch(decrementIndex());
  };

  const next = () => {
    if (articleIndex === filteredArticlesId?.length - 1) return;

    const modalPreviewElement = document.getElementById('editorModal');
    modalPreviewElement.scrollTo({ top: 0, behavior: 'instant' });
    dispatch(incrementIndex());
  };

  const openEditorFromPreview = () => {
    dispatch(setEditorModalStatus('editFP'));

    window.history.pushState({}, '', '#editor');
  }

  return (
    <>
      {editorModalStatus && (
        <div className={`${css.container}`} onClick={close}>
          <div className={`${css.content} ${css[editorModalStatus]}`} onClick={(e) => e.stopPropagation()}>


            {(editorModalStatus === "preview") && (
              <div className={css.navigation}>
                <div className={css.navigationStart}>
                  <div className={css.navigationControlls}>
                    <div className={css.arrowWrapper} onClick={prev}>
                      <div className={css.arrowLeft} />
                    </div>
                    <div className={css.navigationCountBubble}>{`${articleIndex + 1}`}/{filteredArticlesId?.length}</div>
                    <div className={css.arrowWrapper} onClick={next}>
                      <div className={css.arrowRight} />
                    </div>
                  </div>
                  <button className={css.navigationWriteButton} onClick={openEditorFromPreview}>write</button>
                  <ModalArticleSettings />
                </div>
                <div className={css.navigationEnd}>
                  <div className={css.navigationCloseButton} onClick={close}>close</div>
                </div>
              </div>
            )}


            {editorModalStatus !== "preview" && (
              <div className={css.header}>
                <div className={css.headerStart}>
                  <div className={css.headerCloseButton} onClick={close}>close</div>
                </div>
                <div className={css.headerEnd}>
                  <ModalArticleSettings color="blue" />
                </div>
              </div>
            )}


            <div id="editorModal" ref={editorRef} className={css.editor}>
              <Title ref={titleRef} />
              <Editor editorRef={editorRef} titleRef={titleRef} />
            </div>

          </div>
        </div>
      )}
    </>
  );
};
