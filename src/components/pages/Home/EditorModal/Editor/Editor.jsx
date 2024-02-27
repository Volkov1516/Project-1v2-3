// [] Refactor the component
// [x] Data saving
// [] Go to theme
// [] Go to plugins

import { useSelector, useDispatch } from 'react-redux';
import { updateDocuments } from 'redux/features/user/userSlice';
import { updateNotesCache, updateIsNewNote } from 'redux/features/note/noteSlice';
import { db } from 'firebase.js';
import { doc, setDoc } from 'firebase/firestore';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';

import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListItemNode, ListNode } from '@lexical/list';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';

import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';

import { RefreshStatePlugin } from './plugins/RefreshStatePlugin/RefreshStatePlugin';
import { ToolbarBlockPlugin } from './plugins/ToolbarBlockPlugin/ToolbarBlockPlugin';
import { ToolbarTextPlugin } from './plugins/ToolbarTextPlugin/ToolbarTextPlugin';
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { SetEditablePlugin } from './plugins/SetEditablePlugin/SetEditablePlugin';
import { SyncStatePlugin } from './plugins/SyncStatePlugin/SyncStatePlagin';

import { MainTheme } from './themes/MainTheme';

import css from './Editor.module.css';

export const Editor = ({ editorRef, titleRef, saving, setSaving }) => {
  let editorStateAutoSaveTimeout;

  const dispatch = useDispatch();

  const { userId, documents, path } = useSelector(state => state.user);
  const { notesCache, isNewNote, activeNoteMode, activeNoteId, activeNoteContent } = useSelector(state => state.note);

  const initialConfig = {
    namespace: 'Editor',
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

    if (viewportWidth < 640) e.preventDefault();
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
        if (isNewNote) {
          const newNote = {
            id: activeNoteId,
            title: 'Untitled'
          };

          const newDocuments = JSON.parse(JSON.stringify(documents));

          function findFolder(object, id, newObject) {
            if (object.id === id) {
              object.notes.push(newObject);
            } else if (object.folders && object.folders.length > 0) {
              for (let i = 0; i < object.folders.length; i++) {
                findFolder(object.folders[i], id, newObject);
              }
            }
          }

          findFolder(newDocuments, path[path.length - 1], newNote);

          await setDoc(doc(db, 'users', userId), { documents: newDocuments }, { merge: true })
            .then(() => dispatch(updateDocuments(newDocuments)))
            .catch(err => console.log(err));
        }

        // STEP 4: Update notesCache and notes
        await setDoc(doc(db, 'notes', activeNoteId), { content: state }, { merge: true })
          .then(() => {
            if (isNewNote) {
              if (notesCache) {
                dispatch(updateNotesCache([...notesCache, { id: activeNoteId, title: 'Untitled', content: state }]))
              }
              else {
                dispatch(updateNotesCache([{ id: activeNoteId, title: 'Untitled', content: state }]))
              }
            }
            else {
              let notesCacheCopy = JSON.parse(JSON.stringify(notesCache));

              for (let i = 0; i < notesCacheCopy.length; i++) {
                if (notesCacheCopy[i].id === activeNoteId) {
                  notesCacheCopy[i].content = state;
                }
              }

              dispatch(updateNotesCache(notesCacheCopy));
            }
          })
          .catch(err => console.log(err));

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
        <RefreshStatePlugin />
        <SyncStatePlugin />
        <SetEditablePlugin />
        <ListPlugin />
        <CheckListPlugin />
        <HorizontalRulePlugin />
      </div>
    </LexicalComposer>
  );
};
