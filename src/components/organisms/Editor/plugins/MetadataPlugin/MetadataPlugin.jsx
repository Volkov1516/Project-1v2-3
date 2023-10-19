import { useState } from 'react';
import { useSelector } from 'react-redux';

import css from './MetadataPlugin.module.css';

export const MetadataPlugin = () => {
  const { filteredArticles, currentIndex } = useSelector(state => state.article);

  let date = new Date();

  const [colorsMenu, setColorsMenu] = useState(false);

  return (
    <div className={css.container}>
      <div className={css.date}>
        {filteredArticles[currentIndex]?.data()?.date?.toDate().toLocaleDateString() || date.toLocaleDateString()}
      </div>
      <div className={css.color} onClick={() => setColorsMenu(!colorsMenu)} onMouseOver={() => setColorsMenu(true)} onMouseLeave={() => setColorsMenu(false)}>color</div>
      <div className={css.category}>category</div>
      {colorsMenu && (
        <div className={css.colorsContainer} onMouseOver={() => setColorsMenu(true)} onMouseLeave={() => setColorsMenu(false)}>
          <div style={{backgroundColor: "white", color: "black"}}>white</div>
          <div style={{backgroundColor: "black"}}>black</div>
          <div style={{backgroundColor: "red"}}>red</div>
          <div style={{backgroundColor: "orange"}}>orange</div>
          <div style={{backgroundColor: "yellow"}}>yellow</div>
          <div style={{backgroundColor: "green"}}>green</div>
          <div style={{backgroundColor: "blue"}}>blue</div>
          <div style={{backgroundColor: "purple"}}>purple</div>
        </div>
      )}
    </div>
  );
};
