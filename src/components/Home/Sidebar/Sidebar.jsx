import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setFilteredArticlesId,
  setArticleId,
  setArticleTitle,
  setArticleContent,
  setArticleColor,
  setArticleIndex,
  setIsNewArticle
} from 'redux/features/article/articleSlice';
import { setEditorModalStatus } from 'redux/features/modal/modalSlice';
import { v4 as uuidv4 } from 'uuid';

import css from './Sidebar.module.css';

import { EditCategoriesModal } from './EditCategoriesModal/EditCategoriesModal';
import { UserSettingsModal } from './UserSettingsModal/UserSettingsModal';

export const Sidebar = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector(state => state.user);
  const { articles } = useSelector(state => state.article);

  const [activeButtonId, setActiveButtonId] = useState('articles');
  const [mainMenu, setMainMenu] = useState(false);
  const [categoriesMenu, setCategoriesMenu] = useState(false);
  const [activeCategoryText, setActiveCategoryText] = useState('articles');

  const openModalEditor = () => {
    const newId = uuidv4();
    const EMPTY_CONTENT = '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}';

    dispatch(setArticleId(newId));
    dispatch(setArticleTitle(''));
    dispatch(setArticleContent(EMPTY_CONTENT));
    dispatch(setArticleColor(null));
    dispatch(setArticleIndex(null));
    dispatch(setIsNewArticle(true));
    dispatch(setEditorModalStatus('edit'));

    window.history.pushState({}, '', '#editor');
  };

  const handleAll = () => {
    const filteredArticlesId = [];
    articles?.forEach(i => !i?.archive && filteredArticlesId.push(i?.id));

    dispatch(setFilteredArticlesId(filteredArticlesId));
    setActiveButtonId('articles');
    setActiveCategoryText('articles');
    setCategoriesMenu(false);
  };

  const handleArchive = () => {
    const filteredArticlesId = [];
    articles?.forEach(i => i?.archive && filteredArticlesId.push(i?.id));

    dispatch(setFilteredArticlesId(filteredArticlesId));
    setActiveButtonId('archive');
    setActiveCategoryText('archive');
    setCategoriesMenu(false);
  };

  const setFilteredByCategory = (id, name) => {
    const unarchived = articles?.filter(i => !i?.archive);
    let newArr = [];

    unarchived?.map(i => i?.categories?.map(j => {
      if (j.id === id) {
        return newArr.push(i?.id);
      }
      else {
        return i;
      }
    }));

    dispatch(setFilteredArticlesId(newArr));
    setActiveButtonId(id);
    setActiveCategoryText(name);
    setCategoriesMenu(false);
  };

  const handleMainMenu = () => {
    setCategoriesMenu(false);
    setMainMenu(!mainMenu);
  };

  const handleCategoriesMenu = () => {
    setMainMenu(false);
    setCategoriesMenu(!categoriesMenu);
  };

  const categoriesComponent = () => {
    return (
      <div className={css.categoriesContainer}>
        <div id="articles" className={`${css.categoryButton} ${activeButtonId === "articles" && css.activeCategoryButton}`} onClick={handleAll}>articles</div>
        {categories?.map(i => (
          <div id={i?.id} className={`${css.categoryButton} ${activeButtonId === i?.id && css.activeCategoryButton}`} key={i?.id} onClick={() => setFilteredByCategory(i?.id, i?.name)}>
            {i?.name}
          </div>
        ))}
        <div id="archive" className={`${css.categoryButton} ${activeButtonId === "archive" && css.activeCategoryButton}`} onClick={handleArchive}>archive</div>
        <EditCategoriesModal />
      </div>
    );
  };

  const menuComponent = () => {
    return (
      <div className={css.menuContainer}>
        <div className={css.toggleGroup}>
          <span className={css.toggleGroupText}>dark theme</span>
          <label className={css.switch}>
            <input type="checkbox" />
            <span className={css.slider}></span>
          </label>
        </div>
        <div className={css.toggleGroup}>
          <span className={css.toggleGroupText}>striped list</span>
          <label className={css.switch}>
            <input type="checkbox" />
            <span className={css.slider}></span>
          </label>
        </div>
        <div className={css.toggleGroup}>
          <span className={css.toggleGroupText}>column view</span>
          <label className={css.switch}>
            <input type="checkbox" />
            <span className={css.slider}></span>
          </label>
        </div>
        <UserSettingsModal />
      </div>
    );
  };

  return (
    <aside className={css.container}>
      <div className={css.start}>
        <div className={css.categoriesButtonSmall} onClick={handleCategoriesMenu}>{activeCategoryText}</div>
        <div className={css.createButton} onClick={openModalEditor}>CREATE</div>
        <div className={css.categoriesWrapper}>{categoriesComponent()}</div>
      </div>
      <div className={css.end}>
        <div className={css.menuWrapper}>{menuComponent()}</div>
        <div className={css.menuButtonSmall} onClick={handleMainMenu}>menu</div>
      </div>
      {mainMenu && <div className={css.menuWrapperSmall}>{menuComponent()}</div>}
      {categoriesMenu && <div className={css.categoriesWrapperSmall}>{categoriesComponent()}</div>}
    </aside>
  );
};
