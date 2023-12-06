import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { CLEAR_EDITOR_COMMAND } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

export const RefreshStatePlugin = () => {
  const { articleIndex, content } = useSelector(state => state.article);

  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.update(() => {
      if (!content) {
        editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
      }
      else {
        setTimeout(() => {
          const state = editor?.parseEditorState(content);
          editor.setEditorState(state);
        });
      }
    });
  }, [articleIndex, content, editor]);

  return null;
};
