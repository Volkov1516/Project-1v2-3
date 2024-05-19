import css from './Input.module.css';

export const Input = ({ id, label, placeholder, value, onChange, autofocus, onBlur }) => {
  return (
    <div className={css.containe}>
      <label htmlFor={id} className={css.label}>{label}</label>
      <input
        id={id}
        className={css.input}
        type="text"
        autoComplete="off"
        autoFocus={autofocus}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      />
    </div>
  );
};
