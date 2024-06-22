import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCanUndo, setCanRedo } from 'redux/features/note/noteSlice';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  CAN_UNDO_COMMAND,
  CAN_REDO_COMMAND,
  COMMAND_PRIORITY_LOW,
} from 'lexical';
import { mergeRegister } from "@lexical/utils";

export const ManualHistoryPlugin = ({onEditorChange}) => {
  const dispatch = useDispatch();

  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          dispatch(setCanUndo(payload));
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          dispatch(setCanRedo(payload));
          return false;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor, dispatch]);

  useEffect(() => {
    if (onEditorChange) {
      onEditorChange(editor);
    }
  }, [editor, onEditorChange]);

  return null;
};
