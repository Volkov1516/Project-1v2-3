import css from './Button.module.css';

export const Button = ({ text, disabled, onClick }) => {
  return (
    <button className={css.button} disabled={disabled} onClick={onClick}>{text}</button>
  );
};
