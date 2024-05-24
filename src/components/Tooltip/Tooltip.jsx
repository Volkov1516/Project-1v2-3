import css from './Tooltip.module.css';

export const Tooltip = ({ children, text, position }) => {
  return (
    <div className={css.container}>
      <span className={`${css.bubble} ${css[position]}`}>
        {text}
      </span>
      {children}
    </div>
  );
};
