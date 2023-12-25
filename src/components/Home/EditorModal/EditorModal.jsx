import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import css from './EditorModal.module.css';

import { Title } from './Title/Title';
import { Editor } from './Editor/Editor';
import { DocumentSettingsModal } from './DocumentSettingsModal/DocumentSettingsModal';
import { Navigation } from './Navigation/Navigation';
import { Categories } from './Categories/Categories';

export const EditorModal = () => {
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
        <div id="editorModal" className={css.editor} ref={editorRef}>
          <div className={css.header}>
            <div className={css.headerStart}>
              <div className={css.headerCloseButton} onClick={close}>close</div>
            </div>
            <div className={css.headerEnd}>
              {!isNewDocument && <DocumentSettingsModal />}
            </div>
          </div>
          <Title ref={titleRef} saving={saving} setSaving={setSaving} />
          <Editor editorRef={editorRef} titleRef={titleRef} saving={saving} setSaving={setSaving} />
          <Categories />
        </div>
      </div>
    </div>
  );
};
