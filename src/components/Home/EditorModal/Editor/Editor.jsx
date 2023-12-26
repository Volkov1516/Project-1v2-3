import { useSelector, useDispatch } from 'react-redux';
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
  const { userId } = useSelector(state => state.user);
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
      const tempDocId = documentId;

      editorStateAutoSaveTimeout = setTimeout(async () => {
        setSaving(true);

        if (isNewDocument) {
          await setDoc(doc(db, 'documents', tempDocId), { userId, date: Timestamp.fromDate(new Date()), content: state })
            .then(() => {
              dispatch(setIsNewDocument(false));
              dispatch(createDocument({
                userId,
                id: tempDocId,
                content: state,
                date: Timestamp.fromDate(new Date()).toDate().toLocaleDateString(),
              }));
            })
            .catch(error => console.log(error));
        }
        else {
          await updateDoc(doc(db, 'documents', tempDocId), { content: state })
            .then(() => {
              // To avoid false content change after saving and quick navigation
              // Anyway, content for preview changes inside SyncStatePlugin
              if (editorModalStatus !== 'editorModalFromPreview') {
                dispatch(updateDocument({ id: tempDocId, key: 'content', value: state }));
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
        <ListPlugin />
        <CheckListPlugin />
        <HorizontalRulePlugin />
        <SetEditablePlugin />
      </div>
    </LexicalComposer>
  );
};
