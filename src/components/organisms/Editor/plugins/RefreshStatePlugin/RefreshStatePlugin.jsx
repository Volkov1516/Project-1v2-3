import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { CLEAR_EDITOR_COMMAND } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

export const RefreshStatePlugin = ({ setTitleState }) => {
  const { all, currentIndex } = useSelector(state => state.article);

  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.update(() => {
      if (!all[currentIndex]?.data()?.content) {
        editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
      }
      else {
        const state = editor?.parseEditorState(all[currentIndex]?.data()?.content);

        setTimeout(() => {
          editor.setEditorState(state);
          setTitleState(all[currentIndex]?.data()?.title || 'Untitled');
        });

      }
    });
  }, [editor, all, currentIndex, setTitleState]);

  return null;
};
