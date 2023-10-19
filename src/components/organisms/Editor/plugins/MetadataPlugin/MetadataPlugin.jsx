import { useState } from 'react';
import { useSelector } from 'react-redux';

import { doc, updateDoc } from 'firebase/firestore';
import { db } from 'firebase.js';

import css from './MetadataPlugin.module.css';

export const MetadataPlugin = () => {
  const { filteredArticles, currentIndex } = useSelector(state => state.article);

  let date = new Date();

  const [colorsMenu, setColorsMenu] = useState(false);

  const handleColor = async (color) => {
    const id = filteredArticles[currentIndex]?.id;
    const articleRef = doc(db, 'articles', id);

    await updateDoc(articleRef, {
      color: color
    });
  };

  return (
    <div className={css.container}>
      <div className={css.date}>
        {filteredArticles[currentIndex]?.data()?.date?.toDate().toLocaleDateString() || date.toLocaleDateString()}
      </div>
      <div className={`${css.color} ${css[filteredArticles[currentIndex]?.data()?.color]}`} onClick={() => setColorsMenu(!colorsMenu)} onMouseOver={() => setColorsMenu(true)} onMouseLeave={() => setColorsMenu(false)}>color</div>
      <div className={css.category}>category</div>
      {colorsMenu && (
        <div className={css.colorsContainer} onMouseOver={() => setColorsMenu(true)} onMouseLeave={() => setColorsMenu(false)}>
          <div onClick={() => handleColor("white")} style={{backgroundColor: "white", color: "black"}}>white</div>
          <div onClick={() => handleColor("black")} style={{backgroundColor: "black"}}>black</div>
          <div onClick={() => handleColor("red")} style={{backgroundColor: "#e03131"}}>red</div>
          <div onClick={() => handleColor("orange")} style={{backgroundColor: "#fd7e14"}}>orange</div>
          <div onClick={() => handleColor("yellow")} style={{backgroundColor: "#ffd43b"}}>yellow</div>
          <div onClick={() => handleColor("green")} style={{backgroundColor: "#2f9e44"}}>green</div>
          <div onClick={() => handleColor("blue")} style={{backgroundColor: "#1971c2"}}>blue</div>
          <div onClick={() => handleColor("purple")} style={{backgroundColor: "#9c36b5"}}>purple</div>
        </div>
      )}
    </div>
  );
};