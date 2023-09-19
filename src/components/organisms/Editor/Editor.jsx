import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';

import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';

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

  const onEditorChange = (editorState, editor) => {
    let content = JSON.stringify(editorState);

    console.log(editor);
    console.log(content);
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <OnChangePlugin ignoreSelectionChange={true} onChange={onEditorChange} />
      <div className={css.container}>
        <RichTextPlugin
          contentEditable={<ContentEditable spellCheck={false} className={css.input} />}
          placeholder={<div className={css.placeholder}>Start writing to never forget...</div>}
          ErrorBoundary={LexicalErrorBoundary}
        />
      </div>
    </LexicalComposer>
  );
};