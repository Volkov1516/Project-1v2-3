import { useSelector, useDispatch } from 'react-redux';
import { setSnackbar } from 'redux/features/app/appSlice';
import { createInTreeThunk } from 'redux/features/tree/treeSlice';
import { updateNotesCache, updateIsNewNote } from 'redux/features/note/noteSlice';
import { db } from 'services/firebase.js';
import { doc, setDoc } from 'firebase/firestore';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';

import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListItemNode, ListNode } from '@lexical/list';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';

import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { ToolbarBlockPlugin } from './plugins/ToolbarBlockPlugin/ToolbarBlockPlugin';
import { ToolbarTextPlugin } from './plugins/ToolbarTextPlugin/ToolbarTextPlugin';
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { LockPlugin } from './plugins/LockPlugin/LockPlugin';
import { ManualHistoryPlugin } from './plugins/ManualHistoryPlugin/ManualHistoryPlugin';
import { MainTheme } from './themes/MainTheme';

import css from './Lexical.module.css';

export const Lexical = ({ editorRef, titleRef, saving, setSaving, onEditorChange }) => {
  let editorStateAutoSaveTimeout;

  const dispatch = useDispatch();

  const { notesCache, isNewNote, activeNoteId, activeNoteContent } = useSelector(state => state.note);

  const initialConfig = {
    namespace: 'Lexical',
    editorState: activeNoteContent,
    theme: MainTheme,
    nodes: [
      HeadingNode,
      QuoteNode,
      HorizontalRuleNode,
      ListNode,
      ListItemNode,
    ],
    onError(error) {
      throw error;
    },
  };

  const handleContentMenu = e => {
    const viewportWidth = window.visualViewport.width;

    if (viewportWidth <= 480) e.preventDefault();
  };

  const handleEditorChange = (editorState) => {
    if (!saving) {
      // STEP 1: Clear timeout while typing
      clearTimeout(editorStateAutoSaveTimeout);

      let state = JSON.stringify(editorState);

      // STEP 2: Run the new timeout and save data after its time left
      editorStateAutoSaveTimeout = setTimeout(async () => {
        setSaving(true);

        // STEP 3: Update user.documents in isNewNote
        try {
          if (isNewNote) {
            const newNote = {
              id: activeNoteId,
              title: 'Untitled'
            };

            dispatch(createInTreeThunk({ type: 'notes', obj: newNote }));

            await setDoc(doc(db, 'notes', activeNoteId), { content: state }, { merge: true });

            if (notesCache) {
              dispatch(updateNotesCache([...notesCache, { id: activeNoteId, title: 'Untitled', content: state }]))
            }
            else {
              dispatch(updateNotesCache([{ id: activeNoteId, title: 'Untitled', content: state }]))
            }
          }
          else {
            await setDoc(doc(db, 'notes', activeNoteId), { content: state }, { merge: true });

            let notesCacheCopy = JSON.parse(JSON.stringify(notesCache));

            for (let i = 0; i < notesCacheCopy.length; i++) {
              if (notesCacheCopy[i].id === activeNoteId) {
                notesCacheCopy[i].content = state;
              }
            }

            dispatch(updateNotesCache(notesCacheCopy));
          }
        } catch (error) {
          dispatch(setSnackbar('Faild to update note title'));
        }

        // STEP 4: Update isNewNote anyway
        dispatch(updateIsNewNote(false));
        setSaving(false);
      }, 2000);
    }
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className={css.container} onContextMenu={handleContentMenu}>
        <RichTextPlugin
          contentEditable={<ContentEditable spellCheck={false} className={css.input} />}
          ErrorBoundary={LexicalErrorBoundary}
        />
        {isNewNote && <AutoFocusPlugin />}
        <OnChangePlugin ignoreSelectionChange={true} onChange={handleEditorChange} />
        <ToolbarBlockPlugin modalEditorContentRef={editorRef} titleRef={titleRef} />
        <ToolbarTextPlugin modalEditorContentRef={editorRef} />
        <ListPlugin />
        <CheckListPlugin />
        <HorizontalRulePlugin />
        <LockPlugin />
        <HistoryPlugin />
        <ManualHistoryPlugin onEditorChange={onEditorChange} />
      </div>
    </LexicalComposer>
  );
};
