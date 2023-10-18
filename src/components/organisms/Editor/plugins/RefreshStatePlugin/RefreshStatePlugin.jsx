import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { CLEAR_EDITOR_COMMAND } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

export const RefreshStatePlugin = ({ setTitleState }) => {
  const { filteredArticles, currentIndex } = useSelector(state => state.article);

  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.update(() => {
      if (!filteredArticles[currentIndex]?.data()?.content) {
        editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
      }
      else {
        const state = editor?.parseEditorState(filteredArticles[currentIndex]?.data()?.content);

        setTimeout(() => {
          editor.setEditorState(state);
          setTitleState(filteredArticles[currentIndex]?.data()?.title || 'Untitled');
        });

      }
    });
  }, [editor, filteredArticles, currentIndex, setTitleState]);

  return null;
};
