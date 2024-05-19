import css from './Switch.module.css';

export const Switch = ({ checked, onChange }) => {
  return (
    <label className={css.switch}>
      <input
        role="switch"
        type="checkbox"
        className={css.input}
        checked={checked}
        onChange={onChange}
      />
      <span className={css.slider}></span>
    </label>
  );
};
