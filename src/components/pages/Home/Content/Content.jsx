import { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentDocument } from 'redux/features/document/documentSlice';
import { setEditorModalStatus } from 'redux/features/modal/modalSlice';

import { IconButton } from 'components/atoms/IconButton/IconButton';

import css from './Content.module.css';

export const Content = memo(function MemoizedContent({ mouseTimer }) {
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
    dispatch(setEditorModalStatus('editorModalFromComponent'));

    window.history.pushState({ modal: 'editorModalFromComponent' }, '', '#editor');
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
    <div className={css.container} onScroll={onMouseUp}>
      <div className={css.testFolder}>
        <svg className={css.testFolderSvg} viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
          <path d="M853.333333 256H469.333333l-85.333333-85.333333H170.666667c-46.933333 0-85.333333 38.4-85.333334 85.333333v170.666667h853.333334v-85.333334c0-46.933333-38.4-85.333333-85.333334-85.333333z" fill="#FFA000" /><path d="M853.333333 256H170.666667c-46.933333 0-85.333333 38.4-85.333334 85.333333v426.666667c0 46.933333 38.4 85.333333 85.333334 85.333333h682.666666c46.933333 0 85.333333-38.4 85.333334-85.333333V341.333333c0-46.933333-38.4-85.333333-85.333334-85.333333z" fill="#FFCA28" />
        </svg>
        Projects
      </div>
      {documents?.map((i) => filteredDocumentsId.includes(i.id) && (
        <div
          key={i?.id}
          onClick={() => openModalEditor(i?.id, i?.title, i?.content, i?.color, i?.categories, i?.archive)}
          onMouseDown={() => onMouseDown(i?.id, i?.title, i?.content, i?.color, i?.categories, i?.archive)}
          onMouseUp={onMouseUp}
          onTouchStart={() => onMouseDown(i?.id, i?.title, i?.content, i?.color, i?.categories, i?.archive)}
          onTouchEnd={onMouseUp}
          className={`${css.document}`}
        >
          <span className={css[i?.color]} />
          {i?.title || 'Untitled'}
        </div>
      ))}


      <div className={css.testTaskWithCircle}>
        <span className={css.icon}>
          <IconButton path="M480.134-120q-74.673 0-140.41-28.339-65.737-28.34-114.365-76.922-48.627-48.582-76.993-114.257Q120-405.194 120-479.866q0-74.673 28.339-140.41 28.34-65.737 76.922-114.365 48.582-48.627 114.257-76.993Q405.194-840 479.866-840q74.673 0 140.41 28.339 65.737 28.34 114.365 76.922 48.627 48.582 76.993 114.257Q840-554.806 840-480.134q0 74.673-28.339 140.41-28.34 65.737-76.922 114.365-48.582 48.627-114.257 76.993Q554.806-120 480.134-120ZM480-160q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
        </span>
        <span>
          Define the new design system for the project. Define the new design system for the project. Define the new design system for the project. Define the new design system for the project.Define the new design system for the project. Define the new design system for the project.
        </span>
      </div>

      <div className={css.testTaskWithCircle}>
        <span className={css.icon}>
          <IconButton path="M480.134-120q-74.673 0-140.41-28.339-65.737-28.34-114.365-76.922-48.627-48.582-76.993-114.257Q120-405.194 120-479.866q0-74.673 28.339-140.41 28.34-65.737 76.922-114.365 48.582-48.627 114.257-76.993Q405.194-840 479.866-840q74.673 0 140.41 28.339 65.737 28.34 114.365 76.922 48.627 48.582 76.993 114.257Q840-554.806 840-480.134q0 74.673-28.339 140.41-28.34 65.737-76.922 114.365-48.582 48.627-114.257 76.993Q554.806-120 480.134-120ZM480-160q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
        </span>
        <span>
          Here comes some random task...
        </span>
      </div>

      {filteredDocumentsId?.length < 1 && (
        <div className={css.emptyContainer}>
          no documents
        </div>
      )}

    </div>
  );
});
