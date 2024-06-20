import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

export const LockPlugin = () => {
  const dispatch = useDispatch();

  const { lockEditor } = useSelector(state => state.app);

  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    lockEditor ? editor.setEditable(false) : editor.setEditable(true);
  }, [dispatch, lockEditor, editor]);

  return null;
};
