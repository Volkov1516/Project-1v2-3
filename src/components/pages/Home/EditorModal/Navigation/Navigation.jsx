import { memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setEditorModalStatus } from 'redux/features/modal/modalSlice';
import { updateDocumentIndex } from 'redux/features/document/documentSlice';
import { updateActiveNoteMode } from 'redux/features/note/noteSlice';

import { IconButton } from 'components/atoms/IconButton/IconButton';

import css from './Navigation.module.css';

export const Navigation = memo(function MemoizedNavigation() {
  const dispatch = useDispatch();
  const { filteredDocumentsId, documentIndex } = useSelector(state => state.document);

  const close = () => {
    dispatch(updateActiveNoteMode(null));
  };

  const prev = () => {
    if (documentIndex === 0) return;

    dispatch(updateDocumentIndex(documentIndex - 1));

    const modalPreviewElement = document.getElementById('editorModalContent');
    modalPreviewElement.scrollTo({ top: 0, behavior: 'instant' });
  };

  const next = () => {
    if (documentIndex === filteredDocumentsId?.length - 1) return;

    dispatch(updateDocumentIndex(documentIndex + 1));

    const modalPreviewElement = document.getElementById('editorModalContent');
    modalPreviewElement.scrollTo({ top: 0, behavior: 'instant' });
  };

  const openEditorFromPreview = () => {
    dispatch(setEditorModalStatus('editorModalFromPreview'));
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
          <IconButton path="m405.384-120-14.461-115.692q-19.154-5.769-41.423-18.154-22.269-12.385-37.885-26.538L204.923-235l-74.616-130 92.231-69.539q-1.769-10.846-2.923-22.346-1.154-11.5-1.154-22.346 0-10.077 1.154-21.192t2.923-25.038L130.307-595l74.616-128.462 105.923 44.616q17.923-14.923 38.769-26.923 20.846-12 40.539-18.539L405.384-840h149.232l14.461 116.461q23 8.077 40.654 18.539 17.654 10.461 36.346 26.154l109-44.616L829.693-595l-95.308 71.846q3.308 12.385 3.692 22.731.385 10.346.385 20.423 0 9.308-.769 19.654-.77 10.346-3.539 25.038L827.923-365l-74.615 130-107.231-46.154q-18.692 15.693-37.615 26.923-18.923 11.231-39.385 17.77L554.616-120H405.384ZM440-160h78.231L533-268.308q30.231-8 54.423-21.961 24.192-13.962 49.269-38.269L736.462-286l39.769-68-87.539-65.769q5-17.077 6.616-31.423 1.615-14.346 1.615-28.808 0-15.231-1.615-28.808-1.616-13.577-6.616-29.884L777.769-606 738-674l-102.077 42.769q-18.154-19.923-47.731-37.346t-55.961-23.115L520-800h-79.769l-12.462 107.538q-30.231 6.462-55.577 20.808-25.346 14.346-50.423 39.423L222-674l-39.769 68L269-541.231q-5 13.462-7 29.231-2 15.769-2 32.769Q260-464 262-449q2 15 6.231 29.231l-86 65.769L222-286l99-42q23.538 23.769 48.885 38.115 25.346 14.347 57.115 22.347L440-160Zm38.923-220q41.846 0 70.923-29.077 29.077-29.077 29.077-70.923 0-41.846-29.077-70.923Q520.769-580 478.923-580q-42.077 0-71.039 29.077-28.961 29.077-28.961 70.923 0 41.846 28.961 70.923Q436.846-380 478.923-380ZM480-480Z" />
        </div>
      </div>
      <div className={css.navigationEnd}>
        <IconButton onClick={close} path="M256-227.692 227.692-256l224-224-224-224L256-732.308l224 224 224-224L732.308-704l-224 224 224 224L704-227.692l-224-224-224 224Z" />
      </div>
    </div>
  );
});
