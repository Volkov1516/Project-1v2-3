import css from './Button.module.css';

export const Button = ({
  id,
  type,
  variant,
  fullWidth,
  icon,
  iconAlt,
  disabled,
  loading,
  onClick,
  children
}) => {
  const handleTouchStart = e => e.currentTarget.classList.add(css.touch);

  const handleTouchEnd = e => e.currentTarget.classList.remove(css.touch);

  return (
    <button
      id={id}
      className={`${css.button} ${css[variant]} ${fullWidth && css.fullWidth}`}
      type={type ?? 'button'}
      disabled={disabled}
      onClick={onClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {loading ? <div className={css.spinner} /> : <>
        {icon && <img className={css.img} src={icon} alt={iconAlt} />}
        {children}
      </>}
    </button>
  );
};
