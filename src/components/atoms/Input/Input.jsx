import css from './Input.module.css';

export const Input = ({
  id,
  name,
  type,
  label,
  placeholder,
  required,
  pattern,
  autoFocus,
  value,
  onChange,
  onBlur
}) => {
  return (
    <div className={css.container}>
      {label && <label className={css.label} htmlFor={name}>{label}</label>}
      <input
        className={css.input}
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        pattern={pattern}
        autoFocus={autoFocus}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      />
    </div>
  );
};
