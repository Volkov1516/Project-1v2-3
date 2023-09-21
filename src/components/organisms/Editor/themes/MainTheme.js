import css from './MainTheme.module.css';

export const MainTheme = {
  ltr: `${css.ltr}`,
  rtl: `${css.rtl}`,
  paragraph: `${css.paragraph}`,
  heading: {
    h1: `${css.h1}`,
    h2: `${css.h2}`,
    h3: `${css.h3}`,
    h4: `${css.h4}`,
    h5: `${css.h5}`,
    h6: `${css.h6}`
  },
  text: {
    bold: `${css.bold}`,
    italic: `${css.italic}`,
    underline: `${css.underline}`,
    strikethrough: `${css.strikethrough}`,
    underlineStrikethrough: `${css.underlineStrikethrough}`,
    highlight: `${css.highlight}`,
    code: `${css.code}`,
    subscript: `${css.subscript}`,
    superscript: `${css.superscript}`
  },
  list: {
    listitem: `${css.listItem}`,
    ol: `${css.ol}`,
    ul: `${css.ul}`,
    nested: {
      listitem: `${css.nestedListItem}`
    },
    listitemChecked: `${css.listItemChecked}`,
    listitemUnchecked: `${css.listItemUnchecked}`
  },
  quote: `${css.quote}`,
  link: `${css.link}`
};
