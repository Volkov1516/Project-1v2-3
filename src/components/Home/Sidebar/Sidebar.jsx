import { useState, lazy, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setFilteredArticlesId,
  setIsNewArticle,
  setArticleId,
  setArticleTitle,
  setArticleContent,
  setArticleColor,
  setArticleCategories
} from 'redux/features/article/articleSlice';
import { setEditorModalStatus } from 'redux/features/modal/modalSlice';
import { v4 as uuidv4 } from 'uuid';

import css from './Sidebar.module.css';

// import { EditCategoriesModal } from './EditCategoriesModal/EditCategoriesModal';
// import { UserSettingsModal } from './UserSettingsModal/UserSettingsModal';

const LazyEditCategoriesModal = lazy(() => import('./EditCategoriesModal/EditCategoriesModal'));
const LazyUserSettingsModal = lazy(() => import('./UserSettingsModal/UserSettingsModal'));

export const Sidebar = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector(state => state.user);
  const { articles } = useSelector(state => state.article);

  const [activeButtonId, setActiveButtonId] = useState('articles');
  const [mainMenu, setMainMenu] = useState(false);
  const [categoriesMenu, setCategoriesMenu] = useState(false);
  const [activeCategoryText, setActiveCategoryText] = useState('articles');
  const [activeMainMenuButton, setActiveMainMenuButton] = useState(false);
  const [activeCategoriesMenuButton, setActiveCategoriesMenuButton] = useState(false);

  const openModalEditor = () => {
    dispatch(setIsNewArticle(true));
    dispatch(setArticleId(uuidv4()));
    dispatch(setArticleTitle(''));
    dispatch(setArticleContent('{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}'));
    dispatch(setArticleColor(null));
    dispatch(setArticleCategories([]));
    dispatch(setEditorModalStatus('edit'));

    window.history.pushState({ modal: 'new' }, '', '#editor');
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
        <Suspense>
          <LazyEditCategoriesModal />
        </Suspense>
      </div>
    );
  };

  const menuComponent = () => {
    return (
      <div className={css.menuContainer}>
        {/* <div className={css.toggleGroup}>
          <span className={css.toggleGroupText}>striped list</span>
          <label className={css.switch}>
            <input type="checkbox" checked={stripedList} onChange={handleStripedList} />
            <span className={css.slider}></span>
          </label>
        </div> */}
        <Suspense>
          <LazyUserSettingsModal />
        </Suspense>
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
