import css from './Error.module.css';

export const Error = (error) => {
  return (
    <div className={css.errorContainer}>
      <div className={css.errorTitle}>Oops!</div>
      <p>{error?.message}</p>
    </div>
  );
};
