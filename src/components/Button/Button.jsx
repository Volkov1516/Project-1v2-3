import { memo } from 'react';

import css from './Button.module.css';

const Button = memo(function Button({
  type = "button",
  variant,
  size,
  color,
  children,
  onClick,
  onMouseOver,
  onMouseLeave
}) {
  return (
    <button
      className={`${css.button} ${css[variant]} ${css[size]} ${css[color]}`}
      type={type}
      variant={variant}
      onClick={onClick}
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </button>
  );
});

export default Button;
