import css from './Button.module.css';

export const Button = ({
  type,
  children,
  disabled,
  submit,
  onClick
}) => {
  const handleTouchStart = (e) => {
    const element = e.currentTarget;
    element.classList.add(css.touch);
  };

  const handleTouchEnd = (e) => {
    const element = e.currentTarget;
    element.classList.remove(css.touch);
  }

  return (
    <button
      className={`${css.button} ${css[type]}`}
      disabled={disabled}
      type={submit && "submit"}
      onClick={onClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {children}
    </button>
  );
};
