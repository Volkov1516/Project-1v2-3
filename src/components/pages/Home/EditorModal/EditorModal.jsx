import { memo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { Header } from './Header/Header';
import { Title } from './Title/Title';
import { Editor } from './Editor/Editor';

import css from './EditorModal.module.css';

export const EditorModal = memo(function MemoizedEditorModal() {
  const { activeNoteId } = useSelector(state => state.note);

  const editorRef = useRef(null);
  const titleRef = useRef(null);

  const [saving, setSaving] = useState(false);

  const handleClose = () => window.history.back();

  return (
    <div id="editorModalContainer" key={activeNoteId} className={css.container} onClick={handleClose}>
      <div className={css.edit} onClick={(e) => e.stopPropagation()}>
        <Header handleClose={handleClose} />
        <div ref={editorRef} className={css.content}>
          <Title ref={titleRef} />
          <Editor editorRef={editorRef} titleRef={titleRef} saving={saving} setSaving={setSaving} />
        </div>
      </div>
    </div>
  );
});
