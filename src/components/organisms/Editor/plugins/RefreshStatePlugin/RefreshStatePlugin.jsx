import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SET_TITLE } from 'redux/features/article/articleSlice';

import { CLEAR_EDITOR_COMMAND } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

export const RefreshStatePlugin = () => {
  const dispatch = useDispatch();

  const { filteredArticles, articleIndex } = useSelector(state => state.article);

  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.update(() => {
      if (!filteredArticles[articleIndex]?.content) {
        editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
      }
      else {
        const state = editor?.parseEditorState(filteredArticles[articleIndex]?.content);

        setTimeout(() => {
          editor.setEditorState(state);
          dispatch(SET_TITLE(filteredArticles[articleIndex]?.title || 'Untitled'));
        });

      }
    });
  }, [editor, filteredArticles, articleIndex, dispatch]);

  return null;
};
