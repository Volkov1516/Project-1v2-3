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
  COPY_COMMAND,
  CUT_COMMAND,
  PASTE_COMMAND
} from 'lexical';
import {
  $patchStyleText
} from '@lexical/selection';

import css from './FloatingTextToolbarPlugin.module.css';

export const FloatingTextToolbarPlugin = ({ modalEditorContentRef }) => {
  const [editor] = useLexicalComposerContext();

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

  const formatTextColor = () => {
    editor.update(() => {
      const selection = $getSelection();

      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, { color: '#F55050' });
      }
    });
  };

  const paste = async () => {
    try {
      const data = new DataTransfer();

      const items = await navigator.clipboard.read();
      const item = items[0];

      for (const type of item.types) {
        const dataString = await (await item.getType(type)).text();
        data.setData(type, dataString);
      }

      const event = new ClipboardEvent('paste', { clipboardData: data });

      editor.dispatchCommand(PASTE_COMMAND, event);
    } catch (error) {
      alert(`Please, allow clipboard access for paste.`);
    }
  };

  return (modalEditorContentRef?.current && isText && createPortal(
    <div className={css.container} style={{ top: top }}>
      <button id="tool" onClick={() => editor.dispatchCommand(COPY_COMMAND, null)}>Copy</button>
      <button id="tool" onClick={() => editor.dispatchCommand(CUT_COMMAND, null)}>Cut</button>
      <button id="tool" onClick={paste}>Paste</button>
      <button id="tool" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}>B</button>
      <button id="tool" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}>I</button>
      <button id="tool" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}>U</button>
      <button id="tool" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}>S</button>
      <button id="tool" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript')}>S</button>
      <button id="tool" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'superscript')}>S</button>
      <button id="tool" onClick={() => formatTextColor()}>C</button>
      <button id="tool" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'highlight')}>H</button>
      <button id="tool" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')}>C</button>
    </div>,
    modalEditorContentRef?.current
  ));
};
