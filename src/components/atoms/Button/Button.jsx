import css from './Button.module.css';

export const Button = ({
  type = "button",
  variant,
  size,
  children,
  onClick
}) => {
  return (
    <button
      className={`${css.button} ${css[variant]} ${css[size]}`}
      type={type}
      variant={variant}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
