import { memo } from 'react';
import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { Navigation } from './Navigation/Navigation';
import { Title } from './Title/Title';
import { Editor } from './Editor/Editor';
import { Categories } from './Categories/Categories';
import { Settings } from './Settings/Settings';

import { IconButton } from 'components/atoms/IconButton/IconButton';

import css from './EditorModal.module.css';

export const EditorModal = memo(function MemoizedEditorModal() {
  const { editorModalStatus } = useSelector(state => state.modal);
  const { isNewDocument, documentIndex } = useSelector(state => state.document);

  const editorRef = useRef(null);
  const titleRef = useRef(null);
  const categoriesRef = useRef(null);

  const [saving, setSaving] = useState(false);

  const close = () => window.history.back();

  return editorModalStatus && (
    <div className={css.container} key={documentIndex} onClick={close}>
      <div className={css[editorModalStatus]} onClick={(e) => e.stopPropagation()}>
        {editorModalStatus === "preview" && <Navigation />}
        <div id="editorModal" className={css.content} ref={editorRef}>
          <div className={css.header}>
            <div className={css.headerStart}>
            </div>
            <div className={css.headerEnd}>
              {!isNewDocument && <Settings />}
              <IconButton onClick={close} path="M256-227.692 227.692-256l224-224-224-224L256-732.308l224 224 224-224L732.308-704l-224 224 224 224L704-227.692l-224-224-224 224Z" />
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
