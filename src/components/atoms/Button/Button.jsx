import css from './Button.module.css';

export const Button = ({
  type = "button",
  variant,
  children,
  onClick
}) => {
  return (
    <button
      className={`${css.button} ${css[variant]}`}
      type={type}
      variant={variant}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
