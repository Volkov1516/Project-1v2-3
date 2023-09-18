import { db } from 'firebase.js';
import { collection, addDoc, getDocs } from 'firebase/firestore';

import css from './Home.module.css';

import { Header } from 'components/molecules/Header/Header';

export const Home = () => {
  const handlePost = async () => {
    try {
      const docRef = await addDoc(collection(db, "users"), {
        first: "Ada",
        last: "Lovelace",
        born: 1815
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleGet = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data()}`);
    });
  };

  return (
    <div className={css.container}>
      <Header />
      <button onClick={handlePost}>POST</button>
      <button onClick={handleGet}>GET</button>
      <h1 style={{ fontWeight: 800, lineHeight: "1.2em", width: "fit-content", paddingRight: "16px" }}>MISS YOU</h1>
      <h1 style={{ fontWeight: 800, lineHeight: "1.2em", color: "white", backgroundColor: "#1971c2", width: "fit-content", paddingRight: "16px" }}>DIAMONDS AND RUST</h1>
      <p style={{ width: "600px", fontWeight: 400, lineHeight: "1.5em" }}>
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
      </p>
    </div>
  );
};
