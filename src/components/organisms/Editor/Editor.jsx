import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';

import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { ListItemNode, ListNode } from '@lexical/list';

import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { ToolbarBlockPlugin } from './plugins/ToolbarBlockPlugin/ToolbarBlockPlugin';
import { ToolbarTextPlugin } from './plugins/ToolbarTextPlugin/ToolbarTextPlugin';
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';

import { MainTheme } from './themes/MainTheme';

import css from './Editor.module.css';

import { v4 as uuidv4 } from 'uuid';
import { db } from 'firebase.js';
import { doc, setDoc, Timestamp } from 'firebase/firestore';

export const Editor = ({ user, modalEditorContentRef, titleRef, titleState }) => {
  const newId = uuidv4();
  let editorStateAutoSaveTimeout;

  const initialConfig = {
    namespace: 'Editor',
    editable: true,
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
    clearTimeout(editorStateAutoSaveTimeout);

    let state = JSON.stringify(editorState);

    editorStateAutoSaveTimeout = setTimeout(async () => {
      await setDoc(doc(db, 'articles', newId), {
        title: titleState,
        content: state,
        date: Timestamp.fromDate(new Date()),
        userId: user?.uid
      });
    }, 1000);
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <ToolbarBlockPlugin modalEditorContentRef={modalEditorContentRef} titleRef={titleRef} />
      <ToolbarTextPlugin modalEditorContentRef={modalEditorContentRef} />
      <div className={css.container} onContextMenu={handleContentMenu}>
        <RichTextPlugin
          contentEditable={<ContentEditable spellCheck={false} className={css.input} />}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <OnChangePlugin ignoreSelectionChange={true} onChange={onEditorChange} />
        <AutoFocusPlugin />
        <ListPlugin />
        <CheckListPlugin />
        <HorizontalRulePlugin />
      </div>
    </LexicalComposer>
  );
};
