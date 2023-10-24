import { useState } from 'react';
import { useSelector } from 'react-redux';

import { doc, updateDoc, setDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from 'firebase.js';

import css from './MetadataPlugin.module.css';

export const MetadataPlugin = () => {
  const { categories } = useSelector(state => state.user);
  const { filteredArticles, currentIndex, currentId } = useSelector(state => state.article);

  let date = new Date();

  const [colorsMenu, setColorsMenu] = useState(false);
  const [categoriesMenu, setCategoriesMenu] = useState(false);

  const handleColor = async (color) => {
    const id = filteredArticles[currentIndex]?.id;
    const articleRef = doc(db, 'articles', id);

    await updateDoc(articleRef, {
      color: color
    });
  };

  const handleSetCategory = async (id) => {
    await setDoc(doc(db, 'articles', currentId),
      {
        categories: arrayUnion({
          id,
        })
      },
      {
        merge: true
      }
    );
  };

  const handleRemoveCategory = async (id) => {
    const docRef = doc(db, 'articles', currentId);

    await updateDoc(docRef, {
      categories: arrayRemove({ id })
    });
  };

  return (
    <div className={css.container}>
      <div className={css.date}>
        {filteredArticles[currentIndex]?.date || date.toLocaleDateString()}
      </div>
      <div className={`${css.color} ${css[filteredArticles[currentIndex]?.color]}`} onClick={() => setColorsMenu(!colorsMenu)} onMouseOver={() => setColorsMenu(true)} onMouseLeave={() => setColorsMenu(false)}>color</div>
      <div className={css.category} onClick={() => setCategoriesMenu(!categoriesMenu)} onMouseOver={() => setCategoriesMenu(true)} onMouseLeave={() => setCategoriesMenu(false)}>category</div>
      {categories?.map(i => filteredArticles[currentIndex]?.categories?.map(j => {
        return i.id === j.id && <div key={i.id} className={css.category} style={{ color: "#1971c2" }} onClick={() => handleRemoveCategory(i.id)}>#{i?.name}</div>
      }))}
      {colorsMenu && (
        <div className={css.colorsContainer} onMouseOver={() => setColorsMenu(true)} onMouseLeave={() => setColorsMenu(false)}>
          <div onClick={() => handleColor("white")} style={{ backgroundColor: "white", color: "black" }}>white</div>
          <div onClick={() => handleColor("black")} style={{ backgroundColor: "black" }}>black</div>
          <div onClick={() => handleColor("red")} style={{ backgroundColor: "#e03131" }}>red</div>
          <div onClick={() => handleColor("orange")} style={{ backgroundColor: "#fd7e14" }}>orange</div>
          <div onClick={() => handleColor("yellow")} style={{ backgroundColor: "#ffd43b" }}>yellow</div>
          <div onClick={() => handleColor("green")} style={{ backgroundColor: "#2f9e44" }}>green</div>
          <div onClick={() => handleColor("blue")} style={{ backgroundColor: "#1971c2" }}>blue</div>
          <div onClick={() => handleColor("purple")} style={{ backgroundColor: "#9c36b5" }}>purple</div>
        </div>
      )}
      {categoriesMenu && (
        <div className={css.categoriesContainer} onMouseOver={() => setCategoriesMenu(true)} onMouseLeave={() => setCategoriesMenu(false)}>
          {categories?.map(i => <div onClick={() => handleSetCategory(i?.id)}>#{i?.name}</div>)}
        </div>
      )}
    </div>
  );
};
