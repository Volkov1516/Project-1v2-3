import { useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setEditorModalStatus } from 'redux/features/modal/modalSlice';
import { incrementIndex, decrementIndex } from 'redux/features/article/articleSlice';

import css from './EditorModal.module.css';

import { Title } from './Title/Title';
import { Editor } from './Editor/Editor';
import { ArticleSettingsModal } from './ArticleSettingsModal/ArticleSettingsModal';

export const EditorModal = () => {
  const dispatch = useDispatch();
  const { editorModalStatus } = useSelector(state => state.modal);
  const { filteredArticlesId, articleIndex } = useSelector(state => state.article);

  const editorRef = useRef(null);
  const titleRef = useRef(null);

  const [saving, setSaving] = useState(false);

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
      default:
        return;
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

  return editorModalStatus && (
    <div className={css.container} onClick={close}>
      <div className={css[editorModalStatus]} onClick={(e) => e.stopPropagation()}>

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
              <button className={css.navigationEditButton} onClick={openEditorFromPreview}>edit</button>
              <div className={css.navigationSettingsWrapper}>
                <ArticleSettingsModal />
              </div>
            </div>
            <div className={css.navigationEnd}>
              <div className={css.navigationCloseButton} onClick={close}>close</div>
            </div>
          </div>
        )}

        <div id="editorModal" ref={editorRef} className={css.editor}>
          <div className={css.header}>
            <div className={css.headerStart}>
              <div className={css.headerCloseButton} onClick={close}>close</div>
            </div>
            <div className={css.headerEnd}>
              <ArticleSettingsModal openButtonColor="blue" />
            </div>
          </div>
          <div className={css.titleWrapper}>
            <Title ref={titleRef} />
          </div>
          <Editor editorRef={editorRef} titleRef={titleRef} saving={saving} setSaving={setSaving} />
        </div>
      </div>
    </div>
  );
};
