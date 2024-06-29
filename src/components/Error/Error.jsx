import css from './Error.module.css';

const Error = (error) => {
  return (
    <div className={css.errorContainer}>
      <div className={css.errorTitle}>Oops!</div>
      <p>{error?.message}</p>
    </div>
  );
};

export default Error;