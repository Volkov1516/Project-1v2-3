import { useEffect } from 'react';

import { CLEAR_EDITOR_COMMAND } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

export const RefreshStatePlugin = ({articles, currentDocIndex, setTitleState}) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.update(() => {
      if (!articles[currentDocIndex]?.data()?.content) {
        editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
      }
      else {
        const state = editor?.parseEditorState(articles[currentDocIndex]?.data()?.content);

        setTimeout(() => {
          editor.setEditorState(state);
          setTitleState(articles[currentDocIndex]?.data()?.title || 'Untitled');
        });

      }
    });
  }, [currentDocIndex]);

  return null;
};
