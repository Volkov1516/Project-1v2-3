import { useDispatch, useSelector } from 'react-redux';
import { setCurrentDocument } from 'redux/features/document/documentSlice';
import { setEditorModalStatus } from 'redux/features/modal/modalSlice';

import css from './Content.module.css';

export const Content = ({ mouseTimer }) => {
  const dispatch = useDispatch();
  const { documents, filteredDocumentsId } = useSelector(state => state.document);

  const openModalEditor = (id, title, content, color, categories, archive) => {
    let documentIndex;

    for (const [index, value] of filteredDocumentsId?.entries()) {
      if (id === value) {
        documentIndex = index;
      }
    }

    dispatch(setCurrentDocument({
      isNew: false,
      index: documentIndex,
      id,
      title,
      content,
      color,
      categories,
      archive
    }));
    dispatch(setEditorModalStatus('editFC'));

    window.history.pushState({ modal: 'editFC' }, '', '#editor');
  };

  const onMouseDown = (id, title, content, color, categories, archive) => {
    onMouseUp();

    mouseTimer = window.setTimeout(() => {
      window.navigator.vibrate(100);

      let documentIndex;

      for (const [index, value] of filteredDocumentsId?.entries()) {
        if (id === value) {
          documentIndex = index;
        }
      }

      dispatch(setCurrentDocument({
        isNew: false,
        index: documentIndex,
        id,
        title,
        content,
        color,
        categories,
        archive
      }));
      dispatch(setEditorModalStatus('preview'));

      window.history.pushState({ modal: 'preview' }, '', '#preview');
    }, 500);
  };

  const onMouseUp = () => mouseTimer && window.clearTimeout(mouseTimer);

  return (
    <main className={css.container} onScroll={onMouseUp}>
      {documents?.map((i) => filteredDocumentsId.includes(i.id) && (
        <article
          key={i?.id}
          onClick={() => openModalEditor(i?.id, i?.title, i?.content, i?.color, i?.categories, i?.archive)}
          onMouseDown={() => onMouseDown(i?.id, i?.title, i?.content, i?.color, i?.categories, i?.archive)}
          onMouseUp={onMouseUp}
          onTouchStart={() => onMouseDown(i?.id, i?.title, i?.content, i?.color, i?.categories, i?.archive)}
          onTouchEnd={onMouseUp}
          className={css[i?.color]}
        >
          {i?.title || 'Untitled'}
          {/* <span className={css.dot}>.</span> */}
        </article>
      ))}
      {filteredDocumentsId?.length < 1 && (
        <div className={css.emptyContainer}>
          no documents
        </div>
      )}
    </main>
  );
};
