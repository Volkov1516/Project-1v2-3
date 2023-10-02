import { createPortal } from 'react-dom';
import { useEffect, useState, useRef } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  COMMAND_PRIORITY_LOW,
  SELECTION_CHANGE_COMMAND,
  $getSelection,
  $isRangeSelection,
  BLUR_COMMAND,
  KEY_ARROW_RIGHT_COMMAND,
} from 'lexical';
import { $setBlocksType } from '@lexical/selection';
import {
  $createHeadingNode,
  $createQuoteNode,
} from '@lexical/rich-text';
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode';

import css from './ToolbarBlockPlugin.module.css';

export const ToolbarBlockPlugin = ({ modalEditorContentRef }) => {
  const [editor] = useLexicalComposerContext();

  const headerRef = useRef(null);
  const quoteRef = useRef(null);
  const dividerRef = useRef(null);

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
          const top = nativeSelection.anchorNode.offsetTop + 52;
          const viewport = window.visualViewport.width;

          if(viewport > 639) {
            let left = (viewport - 600) / 2;

            setLeft(left);
          }
          else {
            setLeft(16);
          }
          
          setTop(top);
          setIsBlock(true);
        }
        else {
          setIsBlock(false);
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

          headerRef.current?.focus();
          setSelectedTool(0);
        }
      },
      COMMAND_PRIORITY_LOW
    );
  }, [editor, isBlock]);

  useEffect(() => {
    switch (selectedTool) {
      case 0:
        headerRef.current?.focus();
        break;
      case 1:
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
      if (selectedTool === 1) return;

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
    <div onKeyDown={handleKeyDown} className={css.container} style={{ top: top, left: left }}>
      <span className={css.placeholder} onClick={() => editor.focus()}>Type or select: </span>
      <button ref={headerRef} id="tool" onClick={() => formatHeading('h1')}>header</button>
      <button ref={quoteRef} id="tool" onClick={() => formatQuote()}>quote</button>
      <button ref={dividerRef} id="tool" onClick={() => editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined)}>divider</button>
    </div>,
    modalEditorContentRef?.current
  ));
};