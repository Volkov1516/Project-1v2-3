import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { CLEAR_EDITOR_COMMAND } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

export const RefreshStatePlugin = ({ currentDocIndex, setTitleState }) => {
  const { all } = useSelector(state => state.article);

  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.update(() => {
      if (!all[currentDocIndex]?.data()?.content) {
        editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
      }
      else {
        const state = editor?.parseEditorState(all[currentDocIndex]?.data()?.content);

        setTimeout(() => {
          editor.setEditorState(state);
          setTitleState(all[currentDocIndex]?.data()?.title || 'Untitled');
        });

      }
    });
  }, [editor, all, currentDocIndex, setTitleState]);

  return null;
};
