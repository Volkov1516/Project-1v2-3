import { useSelector } from 'react-redux';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';

import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { ListItemNode, ListNode } from '@lexical/list';

import { RefreshStatePlugin } from './plugins/RefreshStatePlugin/RefreshStatePlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { ToolbarBlockPlugin } from './plugins/ToolbarBlockPlugin/ToolbarBlockPlugin';
import { ToolbarTextPlugin } from './plugins/ToolbarTextPlugin/ToolbarTextPlugin';
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';

import { MainTheme } from './themes/MainTheme';

import css from './Editor.module.css';

import { db } from 'firebase.js';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { MetadataPlugin } from './plugins/MetadataPlugin/MetadataPlugin';

export const Editor = ({ 
  modalEditorContentRef, 
  titleRef, 
  setSaving,
  preview = false,
  autofocus = true
}) => {
  const { user } = useSelector(state => state.user);
  const { articleId, content, title } = useSelector(state => state.article);

  let editorStateAutoSaveTimeout;

  const initialConfig = {
    namespace: 'Editor',
    editorState: content,
    editable: !preview,
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
      setSaving(true);

      await setDoc(doc(db, 'articles', articleId), {
        title: title,
        content: state,
        date: Timestamp.fromDate(new Date()),
        userId: user?.id
      });

      setSaving(false);
    }, 1000);
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      {!preview && <ToolbarBlockPlugin modalEditorContentRef={modalEditorContentRef} titleRef={titleRef} />}
      {!preview && <ToolbarTextPlugin modalEditorContentRef={modalEditorContentRef} />}
      <MetadataPlugin />
      <div className={css.container} onContextMenu={handleContentMenu}>
        <RichTextPlugin
          contentEditable={<ContentEditable spellCheck={false} className={css.input} />}
          ErrorBoundary={LexicalErrorBoundary}
        />
        {preview && <RefreshStatePlugin />}
        {!preview && <OnChangePlugin ignoreSelectionChange={true} onChange={onEditorChange} />}
        {!preview && autofocus && <AutoFocusPlugin />}
        <ListPlugin />
        <CheckListPlugin />
        <HorizontalRulePlugin />
      </div>
    </LexicalComposer>
  );
};
