import css from './Home.module.css';

import { Header } from 'components/molecules/Header/Header';

export const Home = ({ user, articles }) => {
  return (
    <div className={css.container}>
      <Header user={user} />
      <div className={css.main}>
        {articles?.map((i) => <article key={i?.id}>{i?.data()?.title}</article>)}
      </div>
    </div>
  );
};
