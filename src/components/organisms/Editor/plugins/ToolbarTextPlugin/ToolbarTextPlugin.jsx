import { createPortal } from 'react-dom';
import { useEffect, useState, useRef } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  FORMAT_TEXT_COMMAND,
  COMMAND_PRIORITY_LOW,
  COMMAND_PRIORITY_CRITICAL,
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
  const [left, setLeft] = useState(0);
  const [transform, setTransform] = useState('none');

  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isSubscript, setIsSubscript] = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);
  const [isCode, setIsCode] = useState(false);

  const [isColorDrpdown, setIsColorDropdown] = useState(false);
  const [isBgDrpdown, setIsBgDropdown] = useState(false);

  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const viewport = window.visualViewport.width;

    if (viewport > 639) {
      setIsSmallScreen(false);
    }
    else if (viewport < 639) {
      setIsSmallScreen(true);
    }
  }, []);

  useEffect(() => {
    editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        const selection = $getSelection();
        const rootElement = editor.getRootElement();
        const nativeSelection = window.getSelection();

        if ($isRangeSelection(selection)) {
          setIsBold(selection.hasFormat('bold'));
          setIsItalic(selection.hasFormat('italic'));
          setIsUnderline(selection.hasFormat('underline'));
          setIsStrikethrough(selection.hasFormat('strikethrough'));
          setIsSubscript(selection.hasFormat('subscript'));
          setIsSuperscript(selection.hasFormat('superscript'));
          setIsCode(selection.hasFormat('code'));
        }

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
          const viewport = window.visualViewport.width;

          if (viewport > 639) {
            const top = rect?.top - textRect?.top + modalEditorContentRef?.current?.scrollTop - 48;

            setTop(top);
            setLeft('50%');
            setTransform('translateX(-50%)');
          }
          else {
            const top = rect?.top - textRect?.top + modalEditorContentRef?.current?.scrollTop - 62;

            setTop(top);
            setLeft(0);
            setTransform('none');
          }

          setIsText(true);
        }
        else {
          setIsBgDropdown(false);
          setIsColorDropdown(false);
          setIsText(false);
        }
      },
      COMMAND_PRIORITY_CRITICAL
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
          setIsColorDropdown(false);
          setIsBgDropdown(false);
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

          boldRef.current?.focus();
          setSelectedTool(0);
        }
      },
      COMMAND_PRIORITY_LOW
    );
  }, [editor]);

  useEffect(() => {
    switch (selectedTool) {
      case 0:
        boldRef.current?.focus();
        break;
      case 1:
        italicRef.current?.focus();
        break;
      case 2:
        underlineRef.current?.focus();
        break;
      case 3:
        strikethroughRef.current?.focus();
        break;
      case 4:
        colorRef.current?.focus();
        break;
      case 5:
        highlightRef.current?.focus();
        break;
      case 6:
        codeRef.current?.focus();
        break;
      case 7:
        superscriptRef.current?.focus();
        break;
      case 8:
        subscriptRef.current?.focus();
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
      if (selectedTool === 8) return;

      setSelectedTool(selectedTool + 1);
    }
    else if (e.keyCode === 40) {
      e.preventDefault();
      setIsText(false);
      setSelectedTool(0);
      setIsColorDropdown(false);
      setIsBgDropdown(false);
      editor.focus();
    }
  };

  const formatTextColor = (color) => {
    editor.update(() => {
      const selection = $getSelection();

      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, { color: color });
      }
    });
  };

  const formatTextBg = (color) => {
    editor.update(() => {
      const selection = $getSelection();

      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, { 'background-color': color });
      }
    });
  };

  return (modalEditorContentRef?.current && isText && createPortal(
    <>
      {isColorDrpdown && (
        <div className={css.dropdown} style={{ top: top - 36, left: left, transform: transform }}>
          <button id="tool" onClick={() => formatTextColor("black")}>none</button>
          <button id="tool" onClick={() => formatTextColor("red")}>red</button>
          <button id="tool" onClick={() => formatTextColor("orange")}>orange</button>
          <button id="tool" onClick={() => formatTextColor("yellow")}>yellow</button>
          <button id="tool" onClick={() => formatTextColor("green")}>green</button>
          <button id="tool" onClick={() => formatTextColor("blue")}>blue</button>
          <button id="tool" onClick={() => formatTextColor("purple")}>purple</button>
        </div>
      )}
      {isBgDrpdown && (
        <div className={css.dropdown} style={{ top: top - 36, left: left, transform: transform }}>
          <button id="tool" onClick={() => formatTextBg("white")}>none</button>
          <button id="tool" onClick={() => formatTextBg("red")}>red</button>
          <button id="tool" onClick={() => formatTextBg("orange")}>orange</button>
          <button id="tool" onClick={() => formatTextBg("yellow")}>yellow</button>
          <button id="tool" onClick={() => formatTextBg("green")}>green</button>
          <button id="tool" onClick={() => formatTextBg("blue")}>blue</button>
          <button id="tool" onClick={() => formatTextBg("purple")}>purple</button>
        </div>
      )}
      <div onKeyDown={handleKeyDown} className={css.container} style={{ top: top, left: left, transform: transform }}>
        {isSmallScreen && (
          <button
            id="tool"
            ref={copyRef}
            onClick={() => editor.dispatchCommand(COPY_COMMAND, null)}
          >
            copy
          </button>
        )}
        <button
          id="tool"
          className={`${css.bold} ${isBold && css.active}`}
          ref={boldRef}
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
        >
          B
        </button>
        <button
          id="tool"
          className={`${css.italic} ${isItalic && css.active}`}
          ref={italicRef}
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
        >
          I
        </button>
        <button
          id="tool"
          className={`${css.underline} ${isUnderline && css.active}`}
          ref={underlineRef}
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
        >
          U
        </button>
        <button
          id="tool"
          className={`${css.strikethrough} ${isStrikethrough && css.active}`}
          ref={strikethroughRef}
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")}
        >
          S
        </button>
        <button
          id="tool"
          className={css.color}
          ref={colorRef}
          onClick={() => {
            setIsBgDropdown(false);
            setIsColorDropdown(!isColorDrpdown);
          }}
        >
          A
        </button>
        <button
          id="tool"
          className={css.highlight}
          ref={highlightRef}
          onClick={() => {
            setIsColorDropdown(false);
            setIsBgDropdown(!isBgDrpdown);
          }}
        >
          A
        </button>
        <button
          id="tool"
          className={`${css.code} ${isCode && css.active}`}
          ref={codeRef}
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code")}
        >
          {`<>`}
        </button>
        <button
          id="tool"
          className={`${isSuperscript && css.active}`}
          ref={superscriptRef}
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "superscript")}
        >
          x<span className={css.superscript}>2</span>
        </button>
        <button
          id="tool"
          className={`${isSubscript && css.active}`}
          ref={subscriptRef}
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "subscript")}
        >
          x<span className={css.subscript}>2</span>
        </button>
      </div>
    </>,
    modalEditorContentRef?.current
  ));
};
