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
} from '@lexical/rich-text';

import css from './FloatingBlockToolbarPlugin.module.css';

export const FloatingBlockToolbarPlugin = ({ modalEditorContentRef }) => {
  const [editor] = useLexicalComposerContext();

  const headerRef = useRef(null);

  const [blockType, setBlockType] = useState('paragraph');
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
          const top = nativeSelection.anchorNode.offsetTop + 44;
          const viewport = window.visualViewport.width;
          let left = (viewport - 600) / 2 + 100;

          setTop(top);
          setLeft(left);
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
        const rootElement = editor.getRootElement();
        const nativeSelection = window.getSelection();
        const nativeEvent = window.event;

        if (
          selection !== null &&
          nativeSelection !== null &&
          !nativeSelection.isCollapsed &&
          rootElement !== null &&
          rootElement.contains(nativeSelection.anchorNode) &&
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
  }, [editor]);

  useEffect(() => {
    switch (selectedTool) {
      case 0:
        headerRef.current?.focus();
        break;
      default:
        return;
    }
  }, [selectedTool]);

  const formatHeading = (headingSize) => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode(headingSize));
        }
      });
    }
  };

  return (modalEditorContentRef?.current && isBlock && createPortal(
    <div className={css.container} style={{ top: top, left: left }}>
      <button ref={headerRef} id="tool" onClick={() => formatHeading('h1')}>header</button>
    </div>,
    modalEditorContentRef?.current
  ));
};
