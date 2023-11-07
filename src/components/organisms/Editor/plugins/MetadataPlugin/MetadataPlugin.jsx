import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateColor, addCategory, removeCategory } from 'redux/features/article/articleSlice';

import { doc, updateDoc, setDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from 'firebase.js';

import css from './MetadataPlugin.module.css';

export const MetadataPlugin = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector(state => state.user);
  const { articleId, date } = useSelector(state => state.article);

  let newDate = new Date();

  const [colorsMenu, setColorsMenu] = useState(false);
  const [categoriesMenu, setCategoriesMenu] = useState(false);

  const handleColor = async (color) => {
    const articleRef = doc(db, 'articles', articleId);

    await updateDoc(articleRef, {
      color: color
    })
      .then(() => {
        dispatch(updateColor({ id: articleId, color: color }));
      })
      .catch((error) => console.log(error));
  };

  const handleSetCategory = async (id) => {
    await setDoc(doc(db, 'articles', articleId),
      {
        categories: arrayUnion({
          id,
        })
      },
      {
        merge: true
      }
    )
      .then(() => {
        dispatch(addCategory({ id: articleId, category: id }));
      })
      .catch((error) => console.log(error));
  };

  const handleRemoveCategory = async (id) => {
    const docRef = doc(db, 'articles', articleId);

    await updateDoc(docRef, {
      categories: arrayRemove({ id })
    })
      .then(() => {
        dispatch(removeCategory({ id: articleId, category: id }));
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className={css.container}>
      <div className={css.date}>
        {date || newDate.toLocaleDateString()}
      </div>
      <div className={css.color} onClick={() => setColorsMenu(!colorsMenu)} onMouseOver={() => setColorsMenu(true)} onMouseLeave={() => setColorsMenu(false)}>color</div>
      <div className={css.category} onClick={() => setCategoriesMenu(!categoriesMenu)} onMouseOver={() => setCategoriesMenu(true)} onMouseLeave={() => setCategoriesMenu(false)}>category</div>
      {categories?.map(i => categories?.map(j => {
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
          {categories?.map(i => <div key={i.id} onClick={() => handleSetCategory(i?.id)}>#{i?.name}</div>)}
        </div>
      )}
    </div>
  );
};
