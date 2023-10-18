import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SET_TITLE } from 'redux/features/article/articleSlice';

import { CLEAR_EDITOR_COMMAND } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

export const RefreshStatePlugin = ({ setTitleState }) => {
  const dispatch = useDispatch();

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
          dispatch(SET_TITLE(filteredArticles[currentIndex]?.data()?.title || 'Untitled'));
        });

      }
    });
  }, [editor, filteredArticles, currentIndex, dispatch]);

  return null;
};
