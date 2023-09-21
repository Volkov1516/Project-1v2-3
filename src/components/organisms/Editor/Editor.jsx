import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';

import { FloatingTextToolbarPlugin } from './plugins/FloatingTextToolbarPlugin/FloatingTextToolbarPlugin';

import { MainTheme } from './themes/MainTheme';

import css from './Editor.module.css';

export const Editor = () => {
  const initialConfig = {
    namespace: 'Editor',
    editable: true,
    theme: MainTheme,
    editorState: null,
    onError(error) {
      throw error;
    },
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <FloatingTextToolbarPlugin />
      <div className={css.container} onContextMenu={handleContextMenu}>
        <RichTextPlugin
          contentEditable={<ContentEditable spellCheck={false} className={css.input} />}
          placeholder={<div className={css.placeholder}>Start writing to never forget...</div>}
          ErrorBoundary={LexicalErrorBoundary}
        />
      </div>
    </LexicalComposer>
  );
};
