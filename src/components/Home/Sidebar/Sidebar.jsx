import { useState, useEffect } from 'react';
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
import { setStripedList } from 'redux/features/user/userSlice';
import { v4 as uuidv4 } from 'uuid';

import css from './Sidebar.module.css';

import { EditCategoriesModal } from './EditCategoriesModal/EditCategoriesModal';
import { UserSettingsModal } from './UserSettingsModal/UserSettingsModal';

export const Sidebar = () => {
  const dispatch = useDispatch();
  const { categories, stripedList } = useSelector(state => state.user);
  const { articles } = useSelector(state => state.article);

  const [activeButtonId, setActiveButtonId] = useState('articles');
  const [mainMenu, setMainMenu] = useState(false);
  const [categoriesMenu, setCategoriesMenu] = useState(false);
  const [activeCategoryText, setActiveCategoryText] = useState('articles');
  const [activeMainMenuButton, setActiveMainMenuButton] = useState(false);
  const [activeCategoriesMenuButton, setActiveCategoriesMenuButton] = useState(false);

  useEffect(() => {
    const a = localStorage.getItem('stripedList');

    if (a === 'true') {
      dispatch(setStripedList(true));
    }
    else {
      dispatch(setStripedList(false));
    }
  }, [dispatch]);

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
    setActiveCategoriesMenuButton(false);
  };

  const handleArchive = () => {
    const filteredArticlesId = [];
    articles?.forEach(i => i?.archive && filteredArticlesId.push(i?.id));

    dispatch(setFilteredArticlesId(filteredArticlesId));
    setActiveButtonId('archive');
    setActiveCategoryText('archive');
    setCategoriesMenu(false);
    setActiveCategoriesMenuButton(false);
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
    setActiveCategoriesMenuButton(false);
  };

  const handleMainMenu = () => {
    setCategoriesMenu(false);
    setMainMenu(!mainMenu);
    setActiveCategoriesMenuButton(false);
    setActiveMainMenuButton(!activeMainMenuButton);
  };

  const handleCategoriesMenu = () => {
    setMainMenu(false);
    setCategoriesMenu(!categoriesMenu);
    setActiveMainMenuButton(false);
    setActiveCategoriesMenuButton(!activeCategoriesMenuButton);
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

  const handleStripedList = (e) => {
    dispatch(setStripedList(e.target.checked));
    localStorage.setItem('stripedList', e.target.checked);
  };

  const menuComponent = () => {
    return (
      <div className={css.menuContainer}>
        <div className={css.toggleGroup}>
          <span className={css.toggleGroupText}>striped list</span>
          <label className={css.switch}>
            <input type="checkbox" checked={stripedList} onChange={handleStripedList} />
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
        <div className={`${css.categoriesButtonSmall} ${activeCategoriesMenuButton && css.activeCategoriesMenuButton}`} onClick={handleCategoriesMenu}>{activeCategoryText}</div>
        <div className={css.createButton} onClick={openModalEditor}>CREATE</div>
        <div className={css.categoriesWrapper}>{categoriesComponent()}</div>
      </div>
      <div className={css.end}>
        <div className={css.menuWrapper}>{menuComponent()}</div>
        <div className={`${css.menuButtonSmall} ${activeMainMenuButton && css.activeMainMenuButton}`} onClick={handleMainMenu}>menu</div>
      </div>
      {mainMenu && <div className={css.menuWrapperSmall}>{menuComponent()}</div>}
      {categoriesMenu && <div className={css.categoriesWrapperSmall}>{categoriesComponent()}</div>}
    </aside>
  );
};
