import css from './Tooltip.module.css';

export const Tooltip = ({ children, text, position }) => {
  return (
    <span className={css.container}>
      <span className={`${css.bubble} ${css[position]}`}>
        {text}
      </span>
      {children}
    </span>
  );
};
