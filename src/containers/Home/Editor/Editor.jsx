import { memo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { Header } from './Header/Header';
import { Title } from './Title/Title';
import { Lexical } from './Lexical/Lexical';

import css from './Editor.module.css';

export const Editor = memo(function MemoizedEditorModal() {
  const { noteModal } = useSelector(state => state.app);
  const { activeNoteId } = useSelector(state => state.note);

  const containerRef = useRef(null);
  const editorRef = useRef(null);
  const titleRef = useRef(null);

  const [saving, setSaving] = useState(false);
  const [editor, setEditor] = useState(null);

  return noteModal && (
    <div ref={containerRef} key={activeNoteId} className={css.container}>
      <div className={css.content}>
        <Header containerRef={containerRef} editor={editor} />
        <div ref={editorRef} className={css.editor}>
          <Title ref={titleRef} />
          <Lexical editorRef={editorRef} titleRef={titleRef} saving={saving} setSaving={setSaving} onEditorChange={setEditor} />
        </div>
      </div>
    </div>
  );
});
