import { memo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveNote } from 'redux/features/note/noteSlice';

import { Header } from './Header/Header';
import { Title } from './Title/Title';
import { Editor } from './Editor/Editor';
import { Navigation } from './Navigation/Navigation';

import css from './EditorModal.module.css';

export const EditorModal = memo(function MemoizedEditorModal() {
  const dispatch = useDispatch();

  const { activeNoteMode, activeNoteId } = useSelector(state => state.note);

  const editorRef = useRef(null);
  const titleRef = useRef(null);

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
    <div id="editorModalContainer" key={activeNoteId} className={css.container} onClick={handleClose}>
      <div className={css[activeNoteMode]} onClick={(e) => e.stopPropagation()}>
        <Header handleClose={handleClose} />
        <div id="editorModalContent" ref={editorRef} className={css.content}>
          <Title ref={titleRef} />
          <Editor editorRef={editorRef} titleRef={titleRef} saving={saving} setSaving={setSaving} />
        </div>
        {activeNoteMode === "preview" && <Navigation />}
      </div>
    </div>
  );
});
