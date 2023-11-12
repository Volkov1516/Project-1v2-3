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
import { SET_MODAL_EDITOR_EMPTY, SET_MODAL_AUTOFOCUS } from 'redux/features/modal/modalSlice';
import { auth } from 'firebase.js';
import { signOut } from 'firebase/auth';
import { v4 as uuidv4 } from 'uuid';
import Button from 'components/atoms/Button/Button';
import { EditCategories } from './EditCategories/EditCategories';
import css from './Sidebar.module.css';

export const Sidebar = () => {
  const dispatch = useDispatch();
  const { categories, user } = useSelector(state => state.user);
  const { articles } = useSelector(state => state.article);

  const [categoriesMenu, setCategoriesMenu] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [displayWidth, setDisplayWidth] = useState(null);

  useEffect(() => {
    setDisplayWidth(window.visualViewport.width);
  }, []);

  const openModalEditor = () => {
    const newId = uuidv4();
    const EMPTY_CONTENT = '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}';

    dispatch(setArticleId(newId));
    dispatch(setArticleTitle(''));
    dispatch(setArticleContent(EMPTY_CONTENT));
    dispatch(setArticleColor(null));
    dispatch(setArticleIndex(null));
    dispatch(setIsNewArticle(true));
    dispatch(SET_MODAL_AUTOFOCUS(true));
    dispatch(SET_MODAL_EDITOR_EMPTY(true));

    window.history.pushState({ modalEditorEmpty: 'opened' }, '', '#editor');
  };

  const handleSignOut = () => {
    signOut(auth).then(() => {
      console.log('Signed out successfully');
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });
  };

  const handleAll = () => {
    const filteredArticlesId = [];
    articles?.forEach(i => !i?.archive && filteredArticlesId.push(i?.id));

    dispatch(setFilteredArticlesId(filteredArticlesId));
  };

  const handleArchive = () => {
    const filteredArticlesId = [];
    articles?.forEach(i => i?.archive && filteredArticlesId.push(i?.id));

    dispatch(setFilteredArticlesId(filteredArticlesId));
  };

  const setFilteredByCategory = (id) => {
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
  };

  const handleCategoriesDropdown = () => {
    setUserMenu(false);
    setCategoriesMenu(!categoriesMenu)
  };

  const handleMenuDropdown = () => {
    setCategoriesMenu(false);
    setUserMenu(!userMenu);
  };

  return (
    <>
      {displayWidth > 639
        ? (
          <aside className={css.container}>
            <div className={css.start}>
              <div className={css.create} onClick={openModalEditor}>CREATE</div>
              <Button variant="text" onClick={handleAll}>articles</Button>
              {categories?.map(i => (
                <Button variant="text" color="blue" key={i?.id} onClick={() => setFilteredByCategory(i?.id)}>#{i?.name}</Button>
              ))}
              <EditCategories />
              <Button variant="text" onClick={handleArchive}>archive</Button>
            </div>
            <div className={css.end}>
              <Button variant="text">settings</Button>
              <Button variant="text" color="blue">{user?.email}</Button>
            </div>
          </aside>
        )
        : (
          <div className={css.containerMobile}>
            <Button variant="text" color="blue" onClick={handleMenuDropdown}>menu</Button>
            <Button variant="text" color="blue" onClick={handleCategoriesDropdown}>articles</Button>
            <Button variant="contained" size="large" onClick={openModalEditor}>CREATE</Button>
            {categoriesMenu && (
              <div className={css.categoriesDropdown}>
                <Button variant="text" size="large" onClick={handleAll}>articles</Button>
                {categories?.map(i => (
                  <Button variant="text" size="large" color="blue" key={i?.id} onClick={() => setFilteredByCategory(i?.id)}>#{i?.name}</Button>
                ))}
                <EditCategories openElementSize="large" />
                <Button variant="text" size="large" onClick={handleArchive}>archive</Button>
              </div>
            )}
            {userMenu && (
              <div className={css.menuDropdown}>
                <Button variant="text" size="large">dark theme</Button>
                <Button variant="text" size="large">eye saver</Button>
                <Button variant="text" size="large">striped list</Button>
                <Button variant="text" size="large" color="blue" onClick={handleSignOut}>sign out</Button>
              </div>
            )}
          </div>
        )
      }
    </>
  );
};
