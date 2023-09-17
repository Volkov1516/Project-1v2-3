import css from './Input.module.css';

export const Input = ({
  id,
  variant,
  name,
  type,
  label,
  placeholder,
  required,
  pattern,
  autoFocus,
  value,
  onChange,
  onBlur,
  dataFocussed,
  error
}) => {
  return (
    <div className={css.container}>
      {label && <label className={css.label} htmlFor={name}>{label}</label>}
      <input
        className={`${css.input} ${css[variant]}`}
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
        data-focussed={dataFocussed}
      />
      <span className={css.error}>{error}</span>
    </div>
  );
};
