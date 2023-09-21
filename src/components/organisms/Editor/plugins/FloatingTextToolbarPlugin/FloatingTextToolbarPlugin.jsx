import React, { useEffect, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  COMMAND_PRIORITY_LOW,
  SELECTION_CHANGE_COMMAND,
  $getSelection,
} from 'lexical';

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

        console.log(selection);
        console.log(nativeSelection);
        console.log(rootElement);

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

  return isText && <div className={css.container}>FloatingTextToolbarPlugin</div>;
};
