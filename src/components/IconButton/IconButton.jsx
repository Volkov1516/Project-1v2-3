import css from './IconButton.module.css';

export const IconButton = ({
  primary,
  path,
  viewBox = '0 -960 960 960',
  onClick,
  small = false,
  snack
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
      className={`${css.button} ${primary && css.primary} ${small && css.small} ${snack && css.snack}`}
      onClick={onClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <svg className={css.svg} viewBox={viewBox} xmlns="http://www.w3.org/2000/svg">
        <path d={path} />
      </svg>
    </button>
  );
};
