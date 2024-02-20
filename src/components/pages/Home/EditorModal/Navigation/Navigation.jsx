import { memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setEditorModalStatus } from 'redux/features/modal/modalSlice';
import { updateDocumentIndex } from 'redux/features/document/documentSlice';

import { Settings } from '../Settings/Settings';
import { IconButton } from 'components/atoms/IconButton/IconButton';

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

  const handleTouchStart = (e) => {
    const element = e.currentTarget;
    element.classList.add(css.touch);
  };

  const handleTouchEnd = (e) => {
    const element = e.currentTarget;
    element.classList.remove(css.touch);
  }

  return (
    <div className={css.navigation}>
      <div className={css.navigationStart}>
        <div className={css.navigationControlls}>
          <button
            disabled={documentIndex === 0}
            className={css.arrowWrapper}
            onClick={prev}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className={css.arrowLeft} />
          </button>
          <div className={css.navigationCountBubble}>{`${documentIndex + 1}`}/{filteredDocumentsId?.length}</div>
          <button
            disabled={documentIndex === filteredDocumentsId?.length - 1}
            className={css.arrowWrapper}
            onClick={next}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className={css.arrowRight} />
          </button>
        </div>
        <IconButton onClick={openEditorFromPreview} path="M200-200h43.923l427.923-427.923-43.923-43.923L200-243.923V-200Zm-40 40v-100.769l555-556.077 101.616 102.538L260.769-160H160Zm600-555.538L715.538-760 760-715.538Zm-110.501 66.039-21.576-22.347 43.923 43.923-22.347-21.576Z" />
        <div className={css.navigationSettingsWrapper}>
          <Settings />
        </div>
      </div>
      <div className={css.navigationEnd}>
        <IconButton onClick={close} path="M256-227.692 227.692-256l224-224-224-224L256-732.308l224 224 224-224L732.308-704l-224 224 224 224L704-227.692l-224-224-224 224Z" />
      </div>
    </div>
  );
});
