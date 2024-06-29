import css from './IconButton.module.css';

const IconButton = ({
  variant,
  size,
  path,
  viewBox,
  isDisabled,
  onClick,
  dataType
}) => {
  const handleTouchStart = e => e.currentTarget.classList.add(css.touch);

  const handleTouchEnd = e => e.currentTarget.classList.remove(css.touch);

  return (
    <button
      data-type={dataType}
      className={`${css.button} ${css[variant]} ${css[size]}`}
      onClick={onClick}
      disabled={isDisabled}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <svg data-type={dataType} className={`${css.svg} ${isDisabled && css.disabled}`} viewBox={viewBox ?? '0 -960 960 960'} xmlns="http://www.w3.org/2000/svg">
        <path d={path} />
      </svg>
    </button>
  );
};

export default IconButton;