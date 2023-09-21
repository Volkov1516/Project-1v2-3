import React, { useEffect, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  FORMAT_TEXT_COMMAND,
  COMMAND_PRIORITY_LOW,
  SELECTION_CHANGE_COMMAND,
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  $isTextNode,
  $isLinkNode
} from 'lexical';
import {
  $patchStyleText,
  $setBlocksType
} from '@lexical/selection';

import css from './FloatingTextToolbarPlugin.module.css';

export const FloatingTextToolbarPlugin = () => {
  const [editor] = useLexicalComposerContext();

  const [isText, setIsText] = useState(false);

  useEffect(() => {
    editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        const selection = $getSelection();
        const nativeSelection = window.getSelection();
        const rootElement = editor.getRootElement();

        if (
          selection !== null &&
          nativeSelection !== null &&
          !nativeSelection.isCollapsed &&
          rootElement !== null &&
          rootElement.contains(nativeSelection.anchorNode)
        ) {
          setIsText(true);
        }
        else {
          setIsText(false);
        }
      },
      COMMAND_PRIORITY_LOW
    )
  }, [editor]);

  const clearFormat = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.getNodes().forEach((node) => {
          if ($isTextNode(node)) {
            node.setFormat(0);
            node.setStyle("");
          } else if ($isLinkNode(node)) {
            const children = node.getChildren();
            for (const child of children) {
              node.insertBefore(child);
            }
            node.remove();
          }
        });
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  };

  const formatTextColor = () => {
    editor.update(() => {
      const selection = $getSelection();

      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, { color: '#F55050' });
      }
    });
  };

  return (isText && <div className={css.container}>
    <button onClick={() => clearFormat()}>clear</button>
    <button onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}>bold</button>
    <button onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}>italic</button>
    <button onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}>underline</button>
    <button onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}>strikethrough</button>
    <button onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript')}>subscript</button>
    <button onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'superscript')}>superscript</button>
    <button onClick={() => formatTextColor()}>color</button>
    <button onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'highlight')}>highlight</button>
    <button onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')}>code</button>
  </div>);
};
