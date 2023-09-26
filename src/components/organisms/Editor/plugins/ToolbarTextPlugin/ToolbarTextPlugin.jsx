import { createPortal } from 'react-dom';
import { useEffect, useState, useRef } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  FORMAT_TEXT_COMMAND,
  COMMAND_PRIORITY_LOW,
  SELECTION_CHANGE_COMMAND,
  $getSelection,
  $isRangeSelection,
  BLUR_COMMAND,
  COPY_COMMAND,
  KEY_ARROW_UP_COMMAND,
} from 'lexical';
import {
  $patchStyleText
} from '@lexical/selection';

import css from './ToolbarTextPlugin.module.css';

export const ToolbarTextPlugin = ({ modalEditorContentRef }) => {
  const [editor] = useLexicalComposerContext();

  const copyRef = useRef(null);
  const boldRef = useRef(null);
  const italicRef = useRef(null);
  const underlineRef = useRef(null);
  const strikethroughRef = useRef(null);
  const subscriptRef = useRef(null);
  const superscriptRef = useRef(null);
  const colorRef = useRef(null);
  const highlightRef = useRef(null);
  const codeRef = useRef(null);

  const [selectedTool, setSelectedTool] = useState(0);
  const [isText, setIsText] = useState(false);
  const [top, setTop] = useState(0);

  useEffect(() => {
    editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        const selection = $getSelection();
        const rootElement = editor.getRootElement();
        const nativeSelection = window.getSelection();

        if (
          selection !== null &&
          nativeSelection !== null &&
          !nativeSelection.isCollapsed &&
          rootElement !== null &&
          rootElement.contains(nativeSelection.anchorNode)
        ) {
          const domRange = nativeSelection.getRangeAt(0);
          const rect = domRange.getBoundingClientRect();
          const textRect = modalEditorContentRef?.current?.getBoundingClientRect();

          const top = rect?.top - textRect?.top + modalEditorContentRef?.current?.scrollTop - 48;

          setTop(top);
          setIsText(true);
        }
        else {
          setIsText(false);
        }
      },
      COMMAND_PRIORITY_LOW
    )
  }, [editor, modalEditorContentRef]);

  useEffect(() => {
    editor.registerCommand(
      BLUR_COMMAND,
      (e) => {
        if (e?.relatedTarget?.id === 'tool') {
          return;
        }
        else {
          setIsText(false);
        }
      },
      COMMAND_PRIORITY_LOW
    );
  }, [editor]);

  useEffect(() => {
    editor.registerCommand(
      KEY_ARROW_UP_COMMAND,
      (e) => {
        const selection = $getSelection();
        const rootElement = editor.getRootElement();
        const nativeSelection = window.getSelection();
        const nativeEvent = window.event;

        if (
          selection !== null &&
          nativeSelection !== null &&
          !nativeSelection.isCollapsed &&
          rootElement !== null &&
          rootElement.contains(nativeSelection.anchorNode) &&
          !nativeEvent.shiftKey
        ) {
          e.preventDefault();

          copyRef.current?.focus();
          setSelectedTool(0);
        }
      },
      COMMAND_PRIORITY_LOW
    );
  }, [editor]);

  useEffect(() => {
    switch (selectedTool) {
      case 0:
        copyRef.current?.focus();
        break;
      case 1:
        boldRef.current?.focus();
        break;
      case 2:
        italicRef.current?.focus();
        break;
      case 3:
        underlineRef.current?.focus();
        break;
      case 4:
        strikethroughRef.current?.focus();
        break;
      case 5:
        subscriptRef.current?.focus();
        break;
      case 6:
        superscriptRef.current?.focus();
        break;
      case 7:
        colorRef.current?.focus();
        break;
      case 8:
        highlightRef.current?.focus();
        break;
      case 9:
        codeRef.current?.focus();
        break;
      default:
        return;
    }
  }, [selectedTool]);

  const handleKeyDown = (e) => {
    if (e.keyCode === 37) {
      if (selectedTool === 0) return;

      setSelectedTool(selectedTool - 1);
    }
    else if (e.keyCode === 38) {
      setSelectedTool(0);
    }
    else if (e.keyCode === 39) {
      if (selectedTool === 9) return;

      setSelectedTool(selectedTool + 1);
    }
    else if (e.keyCode === 40) {
      e.preventDefault();
      setIsText(false);
      setSelectedTool(0);
      editor.focus();
    }
  };

  const formatTextColor = () => {
    editor.update(() => {
      const selection = $getSelection();

      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, { color: '#F55050' });
      }
    });
  };

  return (modalEditorContentRef?.current && isText && createPortal(
    <div onKeyDown={handleKeyDown} className={css.container} style={{ top: top }}>
      <button ref={copyRef} id="tool" onClick={() => editor.dispatchCommand(COPY_COMMAND, null)}>copy</button>
      <button className={css.bold} ref={boldRef} id="tool" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}>B</button>
      <button className={css.italic} ref={italicRef} id="tool" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}>I</button>
      <button className={css.underline} ref={underlineRef} id="tool" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}>U</button>
      <button className={css.strikethrough} ref={strikethroughRef} id="tool" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}>S</button>
      <button ref={subscriptRef} id="tool" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript')}>x<span className={css.subscript}>2</span></button>
      <button ref={superscriptRef} id="tool" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'superscript')}>x<span className={css.superscript}>2</span></button>
      <button className={css.color} ref={colorRef} id="tool" onClick={() => formatTextColor()}>C</button>
      <button className={css.highlight} ref={highlightRef} id="tool" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'highlight')}>H</button>
      <button className={css.code} ref={codeRef} id="tool" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')}>C</button>
    </div>,
    modalEditorContentRef?.current
  ));
};
