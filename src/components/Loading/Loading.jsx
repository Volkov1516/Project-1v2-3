import css from './Loading.module.css';

export const Loading = () => {
  return (
    <div className={css.container}>
      <div className={css.spinner}></div>
    </div>
  );
};
