import css from './Home.module.css';

import { Header } from 'components/molecules/Header/Header';

export const Home = () => {
  return (
    <div className={css.container}>
      <Header />
      <div className={css.main}>
        <h1 style={{ cursor: "pointer", fontSize: "40px", fontWeight: 800, lineHeight: "1.2em", width: "fit-content", paddingRight: "16px" }}>MISS YOU</h1>
        <h1 style={{ cursor: "pointer", fontSize: "40px", fontWeight: 800, lineHeight: "1.2em", color: "white", backgroundColor: "#1971c2", width: "fit-content", paddingRight: "16px" }}>DIAMONDS AND RUST</h1>
        <h1 style={{ cursor: "pointer", fontSize: "40px", fontWeight: 800, lineHeight: "1.2em", width: "fit-content", paddingRight: "16px" }}>ANGIE</h1>
        <h1 style={{ cursor: "pointer", fontSize: "40px", fontWeight: 800, lineHeight: "1.2em", width: "fit-content", paddingRight: "16px" }}>ROSENROT</h1>
        <h1 style={{ cursor: "pointer", fontSize: "40px", fontWeight: 800, lineHeight: "1.2em", width: "fit-content", paddingRight: "16px" }}>SOMENTING ON THE WAY</h1>
        <h1 style={{ cursor: "pointer", fontSize: "40px", fontWeight: 800, lineHeight: "1.2em", width: "fit-content", paddingRight: "16px" }}>BREAKING THE LAW</h1>
        <h1 style={{ cursor: "pointer", fontSize: "40px", fontWeight: 800, lineHeight: "1.2em", width: "fit-content", paddingRight: "16px" }}>SONNE</h1>
        <h1 style={{ cursor: "pointer", fontSize: "40px", fontWeight: 800, lineHeight: "1.2em", width: "fit-content", paddingRight: "16px" }}>BRINGIN ON THE HEARTBREAK</h1>
        <h1 style={{ cursor: "pointer", fontSize: "40px", fontWeight: 800, lineHeight: "1.2em", width: "fit-content", paddingRight: "16px" }}>LOVE BITES</h1>
        <h1 style={{ cursor: "pointer", fontSize: "40px", fontWeight: 800, lineHeight: "1.2em", color: "white", backgroundColor: "#e03131", width: "fit-content", paddingRight: "16px" }}>STAIRWAY TO HEAVEN</h1>
        <h1 style={{ cursor: "pointer", fontSize: "40px", fontWeight: 800, lineHeight: "1.2em", width: "fit-content", paddingRight: "16px" }}>HOLD ON THE LINE</h1>
        <h1 style={{ cursor: "pointer", fontSize: "40px", fontWeight: 800, lineHeight: "1.2em", width: "fit-content", paddingRight: "16px" }}>HYSTERIA</h1>
        <h1 style={{ cursor: "pointer", fontSize: "40px", fontWeight: 800, lineHeight: "1.2em", width: "fit-content", paddingRight: "16px" }}>SAD BUT TRUE</h1>
        <h1 style={{ cursor: "pointer", fontSize: "40px", fontWeight: 800, lineHeight: "1.2em", width: "fit-content", paddingRight: "16px" }}>HAIFISCH</h1>
        <h1 style={{ cursor: "pointer", fontSize: "40px", fontWeight: 800, lineHeight: "1.2em", width: "fit-content", paddingRight: "16px" }}>LONELY NIGHTS</h1>
        <h1 style={{ cursor: "pointer", fontSize: "40px", fontWeight: 800, lineHeight: "1.2em", width: "fit-content", paddingRight: "16px" }}>SLEEPING</h1>
      </div>
    </div>
  );
};
