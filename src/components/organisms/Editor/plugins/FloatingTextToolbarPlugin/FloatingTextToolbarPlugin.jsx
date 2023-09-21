import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  FORMAT_TEXT_COMMAND,
  COMMAND_PRIORITY_LOW,
  SELECTION_CHANGE_COMMAND,
  $getSelection,
  $isRangeSelection,
  BLUR_COMMAND,
} from 'lexical';
import {
  $patchStyleText
} from '@lexical/selection';

import css from './FloatingTextToolbarPlugin.module.css';

export function getDOMRangeRect(
  nativeSelection,
  rootElement,
) {
  const domRange = nativeSelection.getRangeAt(0);

  let rect;

  if (nativeSelection.anchorNode === rootElement) {
    let inner = rootElement;
    while (inner.firstElementChild != null) {
      inner = inner.firstElementChild;
    }
    rect = inner.getBoundingClientRect();
  } else {
    rect = domRange.getBoundingClientRect();
  }

  return rect;
}

export const FloatingTextToolbarPlugin = () => {
  const [editor] = useLexicalComposerContext();

  const [isText, setIsText] = useState(false);
  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);

  useEffect(() => {
    editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        const selection = $getSelection();
        const nativeSelection = window.getSelection();
        const rootElement = editor.getRootElement();

        // Shows 0 if new line is empty
        // console.log(nativeSelection.focusOffset);

        const rangeRect = getDOMRangeRect(nativeSelection, rootElement);
        setTop(rangeRect.top - 32);
        setLeft(rangeRect.left);

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
  }, []);

  const formatTextColor = () => {
    editor.update(() => {
      const selection = $getSelection();

      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, { color: '#F55050' });
      }
    });
  };

  return createPortal((isText && <div className={css.container} style={{ top: top, left: left }}>
    <button id="tool" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}>bold</button>
    <button id="tool" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}>italic</button>
    <button id="tool" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}>underline</button>
    <button id="tool" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}>strikethrough</button>
    <button id="tool" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript')}>subscript</button>
    <button id="tool" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'superscript')}>superscript</button>
    <button id="tool" onClick={() => formatTextColor()}>color</button>
    <button id="tool" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'highlight')}>highlight</button>
    <button id="tool" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')}>code</button>
  </div>), document.body);
};