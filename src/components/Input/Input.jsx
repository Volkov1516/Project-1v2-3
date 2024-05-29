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
  onEnter,
  label,
  error,
  dataFocussed,
  fullWidth
}) => {
  const handleKeyDown = e => {
    if (value && e.key === 'Enter') {
      e.preventDefault();

      onEnter();
    }
  };

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
        onKeyDown={handleKeyDown}
        data-focussed={dataFocussed}
      />
      <span className={css.error}>{error}</span>
    </div>
  );
};
