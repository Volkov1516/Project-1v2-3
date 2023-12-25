import { useSelector, useDispatch } from 'react-redux';
import { setEditorModalStatus } from 'redux/features/modal/modalSlice';
import { updateDocumentIndex } from 'redux/features/document/documentSlice';

import { DocumentSettingsModal } from '../DocumentSettingsModal/DocumentSettingsModal';

import css from './Navigation.module.css';

export const Navigation = () => {
  const dispatch = useDispatch();
  const { filteredDocumentsId, documentIndex } = useSelector(state => state.document);

  const close = () => window.history.back();

  const prev = () => {
    if (documentIndex === 0) return;

    const modalPreviewElement = document.getElementById('editorModal');
    modalPreviewElement.scrollTo({ top: 0, behavior: 'instant' });
    dispatch(updateDocumentIndex(documentIndex - 1));
  };

  const next = () => {
    if (documentIndex === filteredDocumentsId?.length - 1) return;

    const modalPreviewElement = document.getElementById('editorModal');
    modalPreviewElement.scrollTo({ top: 0, behavior: 'instant' });
    dispatch(updateDocumentIndex(documentIndex + 1));
  };

  const openEditorFromPreview = () => {
    dispatch(setEditorModalStatus('editFP'));

    window.history.pushState({ modal: 'editFP' }, '', '#editor');
  }

  return (
    <div className={css.navigation}>
      <div className={css.navigationStart}>
        <div className={css.navigationControlls}>
          <div className={css.arrowWrapper} onClick={prev}>
            <div className={css.arrowLeft} />
          </div>
          <div className={css.navigationCountBubble}>{`${documentIndex + 1}`}/{filteredDocumentsId?.length}</div>
          <div className={css.arrowWrapper} onClick={next}>
            <div className={css.arrowRight} />
          </div>
        </div>
        <button className={css.navigationEditButton} onClick={openEditorFromPreview}>edit</button>
        <div className={css.navigationSettingsWrapper}>
          <DocumentSettingsModal />
        </div>
      </div>
      <div className={css.navigationEnd}>
        <div className={css.navigationCloseButton} onClick={close}>close</div>
      </div>
    </div>
  );
};
