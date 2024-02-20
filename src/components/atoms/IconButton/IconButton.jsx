import css from './IconButton.module.css';

export const IconButton = ({
  primary,
  path,
  viewBox = '0 -960 960 960',
  onClick
}) => {
  const handleClick = (e) => {
    const element = e.currentTarget;

    element.style.active = null;
    element.classList.add(css.pressed);

    setTimeout(function() {
      element.classList.remove(css.pressed);
    }, 100);
  };

  return (
    <button id="iconButton" className={`${css.button} ${primary && css.primary}`} onClick={onClick} onTouchStart={handleClick}>
      <svg className={css.svg} viewBox={viewBox} xmlns="http://www.w3.org/2000/svg">
        <path d={path} />
      </svg>
    </button>
  );
};
