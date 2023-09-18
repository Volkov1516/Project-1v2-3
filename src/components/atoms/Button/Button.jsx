import css from './Button.module.css';

export const Button = ({
  type = "button",
  variant,
  size,
  children,
  onClick,
  onMouseOver,
  onMouseLeave
}) => {
  return (
    <button
      className={`${css.button} ${css[variant]} ${css[size]}`}
      type={type}
      variant={variant}
      onClick={onClick}
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </button>
  );
};
