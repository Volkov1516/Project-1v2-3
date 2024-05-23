import css from './Input.module.css';

export const Input = ({
  id,
  name,
  type,
  placeholder,
  required,
  autofocus,
  autocomplete,
  pattern,
  value,
  onChange,
  onBlur,
  label,
  error,
  dataFocussed,
  fullWidth
}) => {
  return (
    <div className={`${css.container} ${fullWidth && css.fullWidth}`}>
      {label && <label htmlFor={id} className={css.label}>{label}</label>}
      <input
        id={id}
        className={css.input}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        autoFocus={autofocus}
        autoComplete={autocomplete ?? 'off'}
        pattern={pattern}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        data-focussed={dataFocussed}
      />
      <span className={css.error}>{error}</span>
    </div>
  );
};
