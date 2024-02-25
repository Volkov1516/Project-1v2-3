import { useSelector, useDispatch } from 'react-redux';
import { updateDocuments } from 'redux/features/user/userSlice';
import { setIsNewDocument, createDocument, updateDocument } from 'redux/features/document/documentSlice';
import { db } from 'firebase.js';
import { doc, setDoc, updateDoc, Timestamp } from 'firebase/firestore';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';

import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListItemNode, ListNode } from '@lexical/list';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';

import { RefreshStatePlugin } from './plugins/RefreshStatePlugin/RefreshStatePlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { ToolbarBlockPlugin } from './plugins/ToolbarBlockPlugin/ToolbarBlockPlugin';
import { ToolbarTextPlugin } from './plugins/ToolbarTextPlugin/ToolbarTextPlugin';
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { SetEditablePlugin } from './plugins/SetEditablePlugin/SetEditablePlugin';
import { SyncStatePlugin } from './plugins/SyncStatePlugin/SyncStatePlagin';

import { MainTheme } from './themes/MainTheme';

import css from './Editor.module.css';

export const Editor = ({
  editorRef,
  titleRef,
  categoriesRef,
  saving,
  setSaving,
}) => {
  const dispatch = useDispatch();
  const { userId, documents, path } = useSelector(state => state.user);
  const { editorModalStatus } = useSelector(state => state.modal);
  const { isNewDocument, documentId, content } = useSelector(state => state.document);

  let editorStateAutoSaveTimeout;

  const initialConfig = {
    namespace: 'Editor',
    editorState: content,
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

  const handleContentMenu = (e) => {
    const viewportWidth = window.visualViewport.width;

    if (viewportWidth < 640) {
      e.preventDefault();
    }
  };

  const onEditorChange = async (editorState) => {
    if (!saving) {
      clearTimeout(editorStateAutoSaveTimeout);

      let state = JSON.stringify(editorState);

      editorStateAutoSaveTimeout = setTimeout(async () => {
        setSaving(true);

        if (isNewDocument) {
          const newNote = {
            id: documentId,
            title: 'Untitled',
          };

          const newDocuments = JSON.parse(JSON.stringify(documents));

          function findFolder(object, id, newObject) {
            if (object.id === id) {
              object.notes.push(newObject);
              return true;
            } else if (object.folders && object.folders.length > 0) {
              for (let i = 0; i < object.folders.length; i++) {
                if (findFolder(object.folders[i], id, newObject)) {
                  return true;
                }
              }
            }
            return false;
          }

          findFolder(newDocuments, path[path.length - 1], newNote);

          await setDoc(doc(db, 'documents', documentId), { userId, date: Timestamp.fromDate(new Date()), content: state })
            .then(() => {
              dispatch(setIsNewDocument(false));
              dispatch(createDocument({
                userId,
                id: documentId,
                content: state,
                date: Timestamp.fromDate(new Date()).toDate().toLocaleDateString(),
              }));
            })
            .catch(error => console.log(error));

          await setDoc(doc(db, 'users', userId), { documents: newDocuments }, { merge: true })
            .then(() => {
              dispatch(updateDocuments(newDocuments));
            })
            .catch(err => console.log(err));
        }
        else {
          await updateDoc(doc(db, 'documents', documentId), { content: state })
            .then(() => {
              if (editorModalStatus !== 'editorModalFromPreview') {
                dispatch(updateDocument({ id: documentId, key: 'content', value: state }));
              }
            })
            .catch(error => console.log(error));
        }

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
        {(editorModalStatus !== "preview") && <ToolbarBlockPlugin modalEditorContentRef={editorRef} titleRef={titleRef} categoriesRef={categoriesRef} />}
        {(editorModalStatus !== "preview") && <ToolbarTextPlugin modalEditorContentRef={editorRef} />}
        {(editorModalStatus !== "preview") && <OnChangePlugin ignoreSelectionChange={true} onChange={onEditorChange} />}
        {editorModalStatus === "editorModalNew" && <AutoFocusPlugin />}
        {editorModalStatus === "preview" && <RefreshStatePlugin />}
        <SyncStatePlugin />
        <SetEditablePlugin />
        <ListPlugin />
        <CheckListPlugin />
        <HorizontalRulePlugin />
      </div>
    </LexicalComposer>
  );
};
