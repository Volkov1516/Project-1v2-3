import css from './Home.module.css';

import { Header } from 'components/molecules/Header/Header';

export const Home = () => {
  return (
    <div className={css.container}>
      <Header />
      <div className={css.main}>
        <article style={{ cursor: "pointer", fontSize: "40px", fontWeight: 800, lineHeight: "1.2em", width: "fit-content", paddingRight: "16px" }}>MISS YOU</article>
        <article style={{ cursor: "pointer", fontSize: "40px", fontWeight: 800, lineHeight: "1.2em", color: "white", backgroundColor: "#1971c2", width: "fit-content", paddingRight: "16px" }}>DIAMONDS AND RUST</article>
        <article style={{ cursor: "pointer", fontSize: "40px", fontWeight: 800, lineHeight: "1.2em", width: "fit-content", paddingRight: "16px" }}>ANGIE</article>
        <article style={{ cursor: "pointer", fontSize: "40px", fontWeight: 800, lineHeight: "1.2em", width: "fit-content", paddingRight: "16px" }}>ROSENROT</article>
        <article style={{ cursor: "pointer", fontSize: "40px", fontWeight: 800, lineHeight: "1.2em", width: "fit-content", paddingRight: "16px" }}>SOMENTING ON THE WAY</article>
        <article style={{ cursor: "pointer", fontSize: "40px", fontWeight: 800, lineHeight: "1.2em", width: "fit-content", paddingRight: "16px" }}>BREAKING THE LAW</article>
        <article style={{ cursor: "pointer", fontSize: "40px", fontWeight: 800, lineHeight: "1.2em", width: "fit-content", paddingRight: "16px" }}>SONNE</article>
        <article style={{ cursor: "pointer", fontSize: "40px", fontWeight: 800, lineHeight: "1.2em", width: "fit-content", paddingRight: "16px" }}>BRINGIN ON THE HEARTBREAK</article>
        <article style={{ cursor: "pointer", fontSize: "40px", fontWeight: 800, lineHeight: "1.2em", width: "fit-content", paddingRight: "16px" }}>LOVE BITES</article>
        <article style={{ cursor: "pointer", fontSize: "40px", fontWeight: 800, lineHeight: "1.2em", color: "white", backgroundColor: "#e03131", width: "fit-content", paddingRight: "16px" }}>STAIRWAY TO HEAVEN</article>
        <article style={{ cursor: "pointer", fontSize: "40px", fontWeight: 800, lineHeight: "1.2em", width: "fit-content", paddingRight: "16px" }}>HOLD ON THE LINE</article>
        <article style={{ cursor: "pointer", fontSize: "40px", fontWeight: 800, lineHeight: "1.2em", width: "fit-content", paddingRight: "16px" }}>HYSTERIA</article>
        <article style={{ cursor: "pointer", fontSize: "40px", fontWeight: 800, lineHeight: "1.2em", width: "fit-content", paddingRight: "16px" }}>SAD BUT TRUE</article>
        <article style={{ cursor: "pointer", fontSize: "40px", fontWeight: 800, lineHeight: "1.2em", width: "fit-content", paddingRight: "16px" }}>HAIFISCH</article>
        <article style={{ cursor: "pointer", fontSize: "40px", fontWeight: 800, lineHeight: "1.2em", width: "fit-content", paddingRight: "16px" }}>LONELY NIGHTS</article>
        <article style={{ cursor: "pointer", fontSize: "40px", fontWeight: 800, lineHeight: "1.2em", width: "fit-content", paddingRight: "16px" }}>SLEEPING</article>
      </div>
    </div>
  );
};
