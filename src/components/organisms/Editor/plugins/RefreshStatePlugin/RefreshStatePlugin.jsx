import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SET_TITLE, SET_CURRENT_ID } from 'redux/features/article/articleSlice';

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
        setTimeout(() => {
          const state = editor?.parseEditorState(filteredArticles[articleIndex]?.content);

          dispatch(SET_CURRENT_ID(filteredArticles[articleIndex]?.id));
          dispatch(SET_TITLE(filteredArticles[articleIndex]?.title || 'Untitled'));
          editor.setEditorState(state);
        });
      }
    });
  }, [editor, filteredArticles, articleIndex, dispatch]);

  return null;
};
