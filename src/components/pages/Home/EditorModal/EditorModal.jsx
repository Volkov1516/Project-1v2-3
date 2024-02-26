import { memo } from 'react';
import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveNote } from 'redux/features/note/noteSlice';

import { Navigation } from './Navigation/Navigation';
import { Title } from './Title/Title';
import { Editor } from './Editor/Editor';
import { Categories } from './Categories/Categories';
import { Settings } from './Settings/Settings';

import { IconButton } from 'components/atoms/IconButton/IconButton';

import css from './EditorModal.module.css';

export const EditorModal = memo(function MemoizedEditorModal() {
  const dispatch = useDispatch();

  const { activeNoteMode, isNewNote } = useSelector(state => state.note);
  const { documentIndex } = useSelector(state => state.document);

  const editorRef = useRef(null);
  const titleRef = useRef(null);
  const categoriesRef = useRef(null);

  const [saving, setSaving] = useState(false);

  const handleClose = () => {
    dispatch(setActiveNote({
      isNew: null,
      mode: null,
      id: null,
      title: null,
      content: null,
    }));
  };

  return activeNoteMode && (
    <div className={css.container} key={documentIndex} onClick={handleClose}>
      <div className={css[activeNoteMode]} onClick={(e) => e.stopPropagation()}>
        {activeNoteMode === "preview" && <Navigation />}
        <div id="editorModal" className={css.content} ref={editorRef}>
          <div className={css.header}>
            <div className={css.headerStart}>
            </div>
            <div className={css.headerEnd}>
              {!isNewNote && <Settings />}
              <IconButton onClick={handleClose} path="M256-227.692 227.692-256l224-224-224-224L256-732.308l224 224 224-224L732.308-704l-224 224 224 224L704-227.692l-224-224-224 224Z" />
            </div>
          </div>
          <Title ref={titleRef} saving={saving} setSaving={setSaving} />
          <Categories ref={categoriesRef} />
          <Editor editorRef={editorRef} titleRef={titleRef} categoriesRef={categoriesRef} saving={saving} setSaving={setSaving} />
        </div>
      </div>
    </div>
  );
});
