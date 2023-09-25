import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';

import { HeadingNode } from '@lexical/rich-text';

import { FloatingTextToolbarPlugin } from './plugins/FloatingTextToolbarPlugin/FloatingTextToolbarPlugin';
import { FloatingBlockToolbarPlugin } from './plugins/FloatingBlockToolbarPlugin/FloatingBlockToolbarPlugin';

import { MainTheme } from './themes/MainTheme';

import css from './Editor.module.css';

export const Editor = ({ modalEditorContentRef }) => {
  const initialConfig = {
    namespace: 'Editor',
    editable: true,
    theme: MainTheme,
    editorState: null,
    nodes: [
      HeadingNode
    ],
    onError(error) {
      throw error;
    },
  };

  const handleContentMenu = (e) => {
    const viewportWidth = window.visualViewport.width;

    if (viewportWidth < 640) {
      e.preventDefault();
    }
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <FloatingTextToolbarPlugin modalEditorContentRef={modalEditorContentRef} />
      <FloatingBlockToolbarPlugin modalEditorContentRef={modalEditorContentRef} />
      <div className={css.container} onContextMenu={handleContentMenu}>
        <RichTextPlugin
          contentEditable={<ContentEditable spellCheck={false} className={css.input} />}
          placeholder={<div className={css.placeholder}>Start writing to never forget...</div>}
          ErrorBoundary={LexicalErrorBoundary}
        />
      </div>
    </LexicalComposer>
  );
};
