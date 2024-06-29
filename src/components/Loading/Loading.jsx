import css from './Loading.module.css';

const Loading = () => {
  return (
    <div className={css.container}>
      <div className={css.spinner} />
    </div>
  );
};

export default Loading;