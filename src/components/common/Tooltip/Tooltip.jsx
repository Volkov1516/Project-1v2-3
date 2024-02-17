import css from './Tooltip.module.css';

export const Tooltip = ({ children, text }) => {
  return (
    <span className={css.container}>
      <span className={css.bubble}>
        {text}
      </span>
      {children}
    </span>
  );
};
