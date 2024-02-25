import css from './Input.module.css';

export const Input = ({label, placeholder, value, onChange, autofocus}) => {
  return (
    <div className={css.containe}>
      <label htmlFor="input" className={css.label}>{label}</label>
      <input id="input" className={css.input} type="text" autoFocus={autofocus} placeholder={placeholder} value={value} onChange={onChange}/>
    </div>
  );
};
