import { memo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setNoteModal } from 'redux/features/app/appSlice';
import { setActiveNote } from 'redux/features/note/noteSlice';

import { Header } from './Header/Header';
import { Title } from './Title/Title';
import { Lexical } from './Lexical/Lexical';

import css from './Editor.module.css';

export const Editor = memo(function MemoizedEditorModal() {
  const dispatch = useDispatch();

  const { windowWidth, noteModal } = useSelector(state => state.app);
  const { activeNoteId } = useSelector(state => state.note);

  const editorRef = useRef(null);
  const titleRef = useRef(null);

  const [saving, setSaving] = useState(false);

  const handleClose = () => {
    if (windowWidth <= 480) {
      window.history.back();
    }
    else {
      dispatch(setActiveNote({
        isNew: null,
        id: null,
        title: null,
        content: null
      }));
      dispatch(setNoteModal(false));
    }
  };

  return noteModal && (
    <div id="editorModalContainer" key={activeNoteId} className={css.container} onClick={handleClose}>
      <div className={css.content} onClick={(e) => e.stopPropagation()}>
        <Header handleClose={handleClose} />
        <div ref={editorRef} className={css.editor}>
          <Title ref={titleRef} />
          <Lexical editorRef={editorRef} titleRef={titleRef} saving={saving} setSaving={setSaving} />
        </div>
      </div>
    </div>
  );
});
