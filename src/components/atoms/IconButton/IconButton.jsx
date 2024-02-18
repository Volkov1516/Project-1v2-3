import css from './IconButton.module.css';

export const IconButton = ({
  primary,
  size = 'small',
  path,
  viewBox = '0 -960 960 960',
  onClick
}) => {
  return (
    <button className={`${primary && css.primary}`} onClick={onClick}>
      <svg className={`${css[size]}`} viewBox={viewBox} xmlns="http://www.w3.org/2000/svg">
        <path d={path} />
      </svg>
    </button>
  );
};
