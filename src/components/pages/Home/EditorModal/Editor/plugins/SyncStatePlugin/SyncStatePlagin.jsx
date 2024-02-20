import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateDocument } from 'redux/features/document/documentSlice';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

export const SyncStatePlugin = () => {
  const dispatch = useDispatch();
  const { documentId } = useSelector(state => state.document);
  const { editorModalStatus } = useSelector(state => state.modal);

  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (editorModalStatus === 'preview') {
      const editorState = editor.getEditorState();
      const jsonString = JSON.stringify(editorState);

      dispatch(updateDocument({ id: documentId, key: 'content', value: jsonString }));
    }
  }, [editor, documentId, editorModalStatus, dispatch]);

  return null;
};
