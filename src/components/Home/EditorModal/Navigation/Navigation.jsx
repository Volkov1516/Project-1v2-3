import { memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setEditorModalStatus } from 'redux/features/modal/modalSlice';
import { updateDocumentIndex } from 'redux/features/document/documentSlice';

import { Settings } from '../Settings/Settings';

import css from './Navigation.module.css';

export const Navigation = memo(function MemoizedNavigation() {
  const dispatch = useDispatch();
  const { filteredDocumentsId, documentIndex } = useSelector(state => state.document);

  const close = () => window.history.back();

  const prev = () => {
    if (documentIndex === 0) return;

    dispatch(updateDocumentIndex(documentIndex - 1));

    const modalPreviewElement = document.getElementById('editorModal');
    modalPreviewElement.scrollTo({ top: 0, behavior: 'instant' });
  };

  const next = () => {
    if (documentIndex === filteredDocumentsId?.length - 1) return;

    dispatch(updateDocumentIndex(documentIndex + 1));

    const modalPreviewElement = document.getElementById('editorModal');
    modalPreviewElement.scrollTo({ top: 0, behavior: 'instant' });
  };

  const openEditorFromPreview = () => {
    dispatch(setEditorModalStatus('editorModalFromPreview'));

    window.history.pushState({ modal: 'editorModalFromPreview' }, '', '#editor');
  }

  return (
    <div className={css.navigation}>
      <div className={css.navigationStart}>
        <div className={css.navigationControlls}>
          <button disabled={documentIndex === 0} className={css.arrowWrapper} onClick={prev}>
            <div className={css.arrowLeft} />
          </button>
          <div className={css.navigationCountBubble}>{`${documentIndex + 1}`}/{filteredDocumentsId?.length}</div>
          <button disabled={documentIndex === filteredDocumentsId?.length - 1} className={css.arrowWrapper} onClick={next}>
            <div className={css.arrowRight} />
          </button>
        </div>
        <button className={css.navigationEditButton} onClick={openEditorFromPreview}>edit</button>
        <div className={css.navigationSettingsWrapper}>
          <Settings />
        </div>
      </div>
      <div className={css.navigationEnd}>
        <div className={css.navigationCloseButton} onClick={close}>close</div>
      </div>
    </div>
  );
});
