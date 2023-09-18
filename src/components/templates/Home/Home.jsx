import css from './Home.module.css';

import { Header } from 'components/molecules/Header/Header';

export const Home = () => {
  return (
    <div className={css.container}>
      <Header />
      <div className={css.main}>
        <article>MISS YOU</article>
        <article style={{ color: "white", backgroundColor: "#1971c2" }}>DIAMONDS AND RUST</article>
        <article>ANGIE</article>
        <article>ROSENROT</article>
        <article>SOMENTING ON THE WAY</article>
        <article>BREAKING THE LAW</article>
        <article>SONNE</article>
        <article>BRINGIN ON THE HEARTBREAK</article>
        <article>LOVE BITES</article>
        <article style={{ color: "white", backgroundColor: "#e03131" }}>STAIRWAY TO HEAVEN</article>
        <article>HOLD ON THE LINE</article>
        <article>HYSTERIA</article>
        <article>SAD BUT TRUE</article>
        <article>HAIFISCH</article>
        <article>LONELY NIGHTS</article>
        <article>SLEEPING</article>
      </div>
    </div>
  );
};
