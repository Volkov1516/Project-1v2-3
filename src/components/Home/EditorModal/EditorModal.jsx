import { memo } from 'react';
import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { Navigation } from './Navigation/Navigation';
import { Title } from './Title/Title';
import { Editor } from './Editor/Editor';
import { Categories } from './Categories/Categories';
import { Settings } from './Settings/Settings';

import css from './EditorModal.module.css';

export const EditorModal = memo(function MemoizedEditorModal() {
  const { editorModalStatus } = useSelector(state => state.modal);
  const { isNewDocument, documentIndex } = useSelector(state => state.document);

  const editorRef = useRef(null);
  const titleRef = useRef(null);

  const [saving, setSaving] = useState(false);

  const close = () => window.history.back();

  return editorModalStatus && (
    <div className={css.container} key={documentIndex} onClick={close}>
      <div className={css[editorModalStatus]} onClick={(e) => e.stopPropagation()}>
        {editorModalStatus === "preview" && <Navigation />}
        <div id="editorModal" className={css.content} ref={editorRef}>
          <div className={css.header}>
            <div className={css.headerStart}><div className={css.headerCloseButton} onClick={close}>close</div></div>
            <div className={css.headerEnd}>{!isNewDocument && <Settings />}</div>
          </div>
          <Title ref={titleRef} saving={saving} setSaving={setSaving} />
          <Editor editorRef={editorRef} titleRef={titleRef} saving={saving} setSaving={setSaving} />
          <Categories />
        </div>
      </div>
    </div>
  );
});
