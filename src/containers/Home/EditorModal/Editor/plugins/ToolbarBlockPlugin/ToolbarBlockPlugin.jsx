import { createPortal } from 'react-dom';
import { useEffect, useState, useRef } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  COMMAND_PRIORITY_LOW,
  SELECTION_CHANGE_COMMAND,
  $getSelection,
  $isRangeSelection,
  BLUR_COMMAND,
  KEY_ARROW_RIGHT_COMMAND
} from 'lexical';
import { $setBlocksType } from '@lexical/selection';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND, INSERT_CHECK_LIST_COMMAND } from '@lexical/list';

import css from './ToolbarBlockPlugin.module.css';

export const ToolbarBlockPlugin = ({ modalEditorContentRef, titleRef }) => {
  const [editor] = useLexicalComposerContext();

  const h1Ref = useRef(null);
  const h2Ref = useRef(null);
  const h3Ref = useRef(null);
  const quoteRef = useRef(null);
  const bulletListRef = useRef(null);
  const numberListRef = useRef(null);
  const checkListRef = useRef(null);

  const [selectedTool, setSelectedTool] = useState(0);
  const [isBlock, setIsBlock] = useState(false);
  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);

  useEffect(() => {
    editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        const selection = $getSelection();
        const nativeSelection = window.getSelection();
        const node = selection.getNodes();

        if (node[0].__type === ('paragraph' || 'root')) {
          const top = nativeSelection.anchorNode.offsetTop + titleRef.current.scrollHeight + 10;
          const viewport = window.visualViewport.width;

          if (viewport > 699) {
            let left = (modalEditorContentRef?.current?.offsetWidth - 700) / 2;

            setTop(top);
            setLeft(left);
          }
          else {
            setTop(top);
            setLeft(20);
          }

          setIsBlock(true);
        }
        else {
          setIsBlock(false);
        }
      },
      COMMAND_PRIORITY_LOW
    )
  }, [editor, modalEditorContentRef, titleRef]);

  useEffect(() => {
    editor.registerCommand(
      BLUR_COMMAND,
      (e) => {
        if (e?.relatedTarget?.id === 'tool') {
          return;
        }
        else {
          setIsBlock(false);
        }
      },
      COMMAND_PRIORITY_LOW
    );
  }, [editor]);

  useEffect(() => {
    editor.registerCommand(
      KEY_ARROW_RIGHT_COMMAND,
      (e) => {
        const selection = $getSelection();
        const nativeEvent = window.event;
        const node = selection.getNodes();

        if (
          node[0].__type === ('paragraph' || 'root') &&
          !nativeEvent.shiftKey &&
          isBlock
        ) {
          e.preventDefault();

          h1Ref.current?.focus();
          setSelectedTool(0);
        }
      },
      COMMAND_PRIORITY_LOW
    );
  }, [editor, isBlock]);

  useEffect(() => {
    switch (selectedTool) {
      case 0:
        h1Ref.current?.focus();
        break;
      case 1:
        h2Ref.current?.focus();
        break;
      case 2:
        h3Ref.current?.focus();
        break;
      case 3:
        checkListRef.current?.focus();
        break;
      case 4:
        bulletListRef.current?.focus();
        break;
      case 5:
        numberListRef.current?.focus();
        break;
      case 6:
        quoteRef.current?.focus();
        break;
      default:
        return;
    }
  }, [selectedTool]);

  const handleKeyDown = (e) => {
    if (e.keyCode === 37) {
      if (selectedTool === 0) {
        e.preventDefault();
        setSelectedTool(0);
        editor.focus();
      };

      setSelectedTool(selectedTool - 1);
    }
    else if (e.keyCode === 38) {
      e.preventDefault();
      setSelectedTool(0);
      editor.focus();
    }
    else if (e.keyCode === 39) {
      if (selectedTool === 6) return;

      setSelectedTool(selectedTool + 1);
    }
    else if (e.keyCode === 40) {
      e.preventDefault();
      setSelectedTool(0);
      editor.focus();
    }
  };

  const formatHeading = (headingSize) => {
    editor.update(() => {
      const selection = $getSelection();

      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(headingSize));
      }
    });
  };

  const formatQuote = () => {
    editor.update(() => {
      const selection = $getSelection();

      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createQuoteNode());
      }
    });
  };

  return (modalEditorContentRef?.current && isBlock && createPortal(
    <div onKeyDown={handleKeyDown} className={css.container} style={{ top, left }}>
      <span className={css.placeholder} onClick={() => editor.focus()}>Type or use: </span>
      <div className={css.tools}>
        <button ref={h1Ref} id="tool" className={css.tool} onClick={() => formatHeading('h1')}>H1</button>
        <button ref={h2Ref} id="tool" className={css.tool} onClick={() => formatHeading('h2')}>H2</button>
        <button ref={h3Ref} id="tool" className={css.tool} onClick={() => formatHeading('h3')}>H3</button>
        <button ref={checkListRef} id="tool" className={css.tool} onClick={() => editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined)}>to-do</button>
        <button ref={bulletListRef} id="tool" className={css.tool} onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}>bullet list</button>
        <button ref={numberListRef} id="tool" className={css.tool} onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}>number list</button>
        <button ref={quoteRef} id="tool" className={css.tool} onClick={() => formatQuote()}>quote</button>
      </div>
    </div>,
    modalEditorContentRef?.current
  ));
};
