import css from './IconButton.module.css';

export const IconButton = ({
  primary,
  path,
  viewBox = '0 -960 960 960',
  onClick
}) => {
  return (
    <button id="iconButton" className={`${css.button} ${primary && css.primary}`} onClick={onClick}>
      <svg className={css.svg} viewBox={viewBox} xmlns="http://www.w3.org/2000/svg">
        <path d={path} />
      </svg>
    </button>
  );
};
