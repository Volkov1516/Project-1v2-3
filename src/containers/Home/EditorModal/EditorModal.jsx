import { memo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setNoteModal } from 'redux/features/app/appSlice';

import { Header } from './Header/Header';
import { Title } from './Title/Title';
import { Editor } from './Editor/Editor';

import css from './EditorModal.module.css';

export const EditorModal = memo(function MemoizedEditorModal() {
  const dispatch = useDispatch();

  const { windowWidth, noteModal } = useSelector(state => state.app);
  const { activeNoteId } = useSelector(state => state.note);

  const editorRef = useRef(null);
  const titleRef = useRef(null);

  const [saving, setSaving] = useState(false);

  const handleClose = () => windowWidth <= 480 ? window.history.back() : dispatch(setNoteModal(false));

  return noteModal && (
    <div id="editorModalContainer" key={activeNoteId} className={css.container} onClick={handleClose}>
      <div className={css.content} onClick={(e) => e.stopPropagation()}>
        <Header handleClose={handleClose} />
        <div ref={editorRef} className={css.editor}>
          <Title ref={titleRef} />
          <Editor editorRef={editorRef} titleRef={titleRef} saving={saving} setSaving={setSaving} />
        </div>
      </div>
    </div>
  );
});
