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

  const textColorWhite = useRef(null);
  const textColorBlack = useRef(null);
  const textColorRed = useRef(null);
  const textColorOrange = useRef(null);
  const textColorYellow = useRef(null);
  const textColorGreen = useRef(null);
  const textColorBlue = useRef(null);
  const textColorPurple = useRef(null);

  const textBgWhite = useRef(null);
  const textBgBlack = useRef(null);
  const textBgRed = useRef(null);
  const textBgOrange = useRef(null);
  const textBgYellow = useRef(null);
  const textBgGreen = useRef(null);
  const textBgBlue = useRef(null);
  const textBgPurple = useRef(null);

  const [selectedTool, setSelectedTool] = useState(0);
  const [selectedToolTextColor, setSelectedToolTextColor] = useState(0);
  const [selectedToolTextBg, setSelectedToolTextBg] = useState(0);
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

  useEffect(() => {
    switch (selectedToolTextColor) {
      case 0:
        textColorWhite.current?.focus();
        break;
      case 1:
        textColorBlack.current?.focus();
        break;
      case 2:
        textColorRed.current?.focus();
        break;
      case 3:
        textColorOrange.current?.focus();
        break;
      case 4:
        textColorYellow.current?.focus();
        break;
      case 5:
        textColorGreen.current?.focus();
        break;
      case 6:
        textColorBlue.current?.focus();
        break;
      case 7:
        textColorPurple.current?.focus();
        break;
      default:
        return;
    }
  }, [selectedToolTextColor, isColorDrpdown]);

  useEffect(() => {
    switch (selectedToolTextBg) {
      case 0:
        textBgWhite.current?.focus();
        break;
      case 1:
        textBgBlack.current?.focus();
        break;
      case 2:
        textBgRed.current?.focus();
        break;
      case 3:
        textBgOrange.current?.focus();
        break;
      case 4:
        textBgYellow.current?.focus();
        break;
      case 5:
        textBgGreen.current?.focus();
        break;
      case 6:
        textBgBlue.current?.focus();
        break;
      case 7:
        textBgPurple.current?.focus();
        break;
      default:
        return;
    }
  }, [selectedToolTextBg, isBgDrpdown]);

  const handleKeyDown = (e) => {
    if (e.keyCode === 37) {
      if (selectedTool === 0) return;

      setSelectedTool(selectedTool - 1);
    }
    else if (e.keyCode === 38) {
      if (selectedTool === 4) {
        setSelectedToolTextColor(0);
        setIsColorDropdown(true);
      }
      else if (selectedTool === 5) {
        setSelectedToolTextBg(0);
        setIsBgDropdown(true);
      }
      else {
        setSelectedTool(0);
      }
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

  const handleTextColorKeyDown = (e) => {
    if (e.keyCode === 37) {
      if (selectedToolTextColor === 0) return;

      setSelectedToolTextColor(selectedToolTextColor - 1);
    }
    else if (e.keyCode === 38) {
      return;
    }
    else if (e.keyCode === 39) {
      if (selectedToolTextColor === 7) return;

      setSelectedToolTextColor(selectedToolTextColor + 1);
    }
    else if (e.keyCode === 40) {
      setIsColorDropdown(false);
      setSelectedToolTextColor(0);
      colorRef?.current?.focus();
    }
  };

  const handleTextBgKeyDown = (e) => {
    if (e.keyCode === 37) {
      if (selectedToolTextBg === 0) return;

      setSelectedToolTextBg(selectedToolTextBg - 1);
    }
    else if (e.keyCode === 38) {
      return;
    }
    else if (e.keyCode === 39) {
      if (selectedToolTextBg === 7) return;

      setSelectedToolTextBg(selectedToolTextBg + 1);
    }
    else if (e.keyCode === 40) {
      setIsBgDropdown(false);
      setSelectedToolTextBg(0);
      highlightRef?.current?.focus();
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
        <div onKeyDown={handleTextColorKeyDown} className={css.dropdown} style={{ top: top - 36, left: left, transform: transform }}>
          <button
            ref={textColorWhite}
            id="tool"
            onClick={() => formatTextColor("white")}
            style={{ color: "white" }}
          >
            a
          </button>
          <button
            ref={textColorBlack}
            id="tool"
            onClick={() => formatTextColor("black")}
            style={{ color: "black" }}
          >
            a
          </button>
          <button
            ref={textColorRed}
            id="tool"
            onClick={() => formatTextColor("red")}
            style={{ color: "red" }}
          >
            a
          </button>
          <button
            ref={textColorOrange}
            id="tool"
            onClick={() => formatTextColor("orange")}
            style={{ color: "orange" }}
          >
            a
          </button>
          <button
            ref={textColorYellow}
            id="tool"
            onClick={() => formatTextColor("yellow")}
            style={{ color: "yellow" }}
          >
            a
          </button>
          <button
            ref={textColorGreen}
            id="tool"
            onClick={() => formatTextColor("green")}
            style={{ color: "green" }}
          >
            a
          </button>
          <button
            ref={textColorBlue}
            id="tool"
            onClick={() => formatTextColor("blue")}
            style={{ color: "blue" }}
          >
            a
          </button>
          <button
            ref={textColorPurple}
            id="tool"
            onClick={() => formatTextColor("purple")}
            style={{ color: "purple" }}
          >
            a
          </button>
        </div>
      )}
      {isBgDrpdown && (
        <div onKeyDown={handleTextBgKeyDown} className={css.dropdown} style={{ top: top - 36, left: left, transform: transform }}>
          <button
            ref={textBgWhite}
            id="tool"
            onClick={() => formatTextBg("white")}
          >
            <mark style={{ backgroundColor: "white", padding: "0px 8px", borderRadius: "2px" }}>
              a
            </mark>
          </button>
          <button
            ref={textBgBlack}
            id="tool"
            onClick={() => formatTextBg("black")}
          >
            <mark style={{ color: "white", backgroundColor: "black", padding: "0px 8px", borderRadius: "2px" }}>
              a
            </mark>
          </button>
          <button
            ref={textBgRed}
            id="tool"
            onClick={() => formatTextBg("red")}
          >
            <mark style={{ backgroundColor: "red", padding: "0px 8px", borderRadius: "2px" }}>
              a
            </mark>
          </button>
          <button
            ref={textBgOrange}
            id="tool"
            onClick={() => formatTextBg("orange")}
          >
            <mark style={{ backgroundColor: "orange", padding: "0px 8px", borderRadius: "2px" }}>
              a
            </mark>
          </button>
          <button
            ref={textBgYellow}
            id="tool"
            onClick={() => formatTextBg("yellow")}
          >
            <mark style={{ backgroundColor: "yellow", padding: "0px 8px", borderRadius: "2px" }}>
              a
            </mark>
          </button>
          <button
            ref={textBgGreen}
            id="tool"
            onClick={() => formatTextBg("green")}
          >
            <mark style={{ backgroundColor: "green", padding: "0px 8px", borderRadius: "2px" }}>
              a
            </mark>
          </button>
          <button
            ref={textBgBlue}
            id="tool"
            onClick={() => formatTextBg("blue")}
          >
            <mark style={{ backgroundColor: "blue", padding: "0px 8px", borderRadius: "2px" }}>
              a
            </mark>
          </button>
          <button
            ref={textBgPurple}
            id="tool"
            onClick={() => formatTextBg("purple")}
          >
            <mark style={{ backgroundColor: "purple", padding: "0px 8px", borderRadius: "2px" }}>
              a
            </mark>
          </button>
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
          C
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
          <mark>
            H
          </mark>
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
