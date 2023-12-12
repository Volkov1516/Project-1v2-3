import { useSelector, useDispatch } from 'react-redux';
import { setIsNewArticle, addArticle, updateArticle } from 'redux/features/article/articleSlice';
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

import { MainTheme } from './themes/MainTheme';

import css from './Editor.module.css';
import { SetEditablePlugin } from './plugins/SetEditablePlugin/SetEditablePlugin';

export const Editor = ({
  editorRef,
  titleRef,
  saving,
  setSaving,
}) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.user);
  const { editorModalStatus } = useSelector(state => state.modal);
  const { articleId, content, title, isNewArticle } = useSelector(state => state.article);

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

        if (isNewArticle) {
          await setDoc(doc(db, 'articles', articleId), {
            title: title,
            content: state,
            date: Timestamp.fromDate(new Date()),
            userId: user?.id
          })
            .then(() => {
              dispatch(setIsNewArticle(false));
              dispatch(addArticle({
                id: articleId,
                title: title,
                content: state,
                date: Timestamp.fromDate(new Date()).toDate().toLocaleDateString(),
                userId: user?.id
              }));
            })
            .catch((error) => console.log(error));
        }
        else {
          await updateDoc(doc(db, 'articles', articleId), {
            title: title,
            content: state,
          })
            .then(() => {
              dispatch(updateArticle({
                id: articleId,
                title: title,
                content: state
              }));
            })
            .catch((error) => console.log(error));
        }

        setSaving(false);
      }, 1000);
    }
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      {(editorModalStatus !== "preview") && <ToolbarBlockPlugin modalEditorContentRef={editorRef} titleRef={titleRef} />}
      {(editorModalStatus !== "preview") && <ToolbarTextPlugin modalEditorContentRef={editorRef} />}
      <div className={css.container} onContextMenu={handleContentMenu}>
        <RichTextPlugin
          contentEditable={<ContentEditable spellCheck={false} className={css.input} />}
          ErrorBoundary={LexicalErrorBoundary}
        />
        {editorModalStatus !== "preview" && <OnChangePlugin ignoreSelectionChange={true} onChange={onEditorChange} />}
        {editorModalStatus === "edit" && <AutoFocusPlugin />}
        {editorModalStatus === "preview" && <RefreshStatePlugin />}
        <ListPlugin />
        <CheckListPlugin />
        <HorizontalRulePlugin />
        <SetEditablePlugin />
      </div>
    </LexicalComposer>
  );
};
