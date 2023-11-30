import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

export const SetEditablePlugin = () => {
  const dispatch = useDispatch();
  const { editorModalStatus } = useSelector(state => state.modal);

  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (editorModalStatus === "preview") {
      editor.setEditable(false);
    }
    else {
      editor.setEditable(true);
    }
  }, [dispatch, editorModalStatus, editor]);

  return null;
};
