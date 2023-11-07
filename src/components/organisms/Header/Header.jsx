import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentId, setContent, setFilteredArticlesId, setTitle, setCurrentIndex, setNewArticle } from 'redux/features/article/articleSlice';
import { SET_MODAL_EDITOR_EMPTY, SET_MODAL_AUTOFOCUS } from 'redux/features/modal/modalSlice';
import { auth } from 'firebase.js';
import { signOut } from 'firebase/auth';
import { v4 as uuidv4 } from 'uuid';

import css from './Header.module.css';

import Button from 'components/atoms/Button/Button';
import { ModalCategory } from '../../molecules/ModalCategory/ModalCategory';

export const Header = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector(state => state.user);
  const { articles } = useSelector(state => state.article);
  const EMPTY_CONTENT = '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}';

  const [categoriesMenu, setCategoriesMenu] = useState(false);
  const [userMenu, setUserMenu] = useState(false);

  const openModalEditor = () => {
    window.history.pushState({ modalEditorEmpty: 'opened' }, '', '#editor');

    const newId = uuidv4();
    dispatch(setCurrentId(newId));
    dispatch(setCurrentIndex(null));
    dispatch(setTitle(''));
    dispatch(setContent(EMPTY_CONTENT));
    dispatch(setNewArticle(true));
    dispatch(SET_MODAL_AUTOFOCUS(true));
    dispatch(SET_MODAL_EDITOR_EMPTY(true));
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

  return (
    <div className={css.container}>
      <div className={css.left}>
        <Button variant="contained" size="large" onClick={openModalEditor}>CREATE</Button>
        <Button
          variant="text"
          onClick={() => setCategoriesMenu(!categoriesMenu)}
          onMouseOver={() => setCategoriesMenu(true)}
          onMouseLeave={() => setCategoriesMenu(false)}
        >
          all articles
        </Button>
      </div>
      <div className={css.right}>
        <Button variant="text" onClick={() => setUserMenu(!userMenu)} onMouseOver={() => setUserMenu(true)} onMouseLeave={() => setUserMenu(false)}>menu</Button>
      </div>
      {categoriesMenu && (
        <div className={css.dropdown} onMouseOver={() => setCategoriesMenu(true)} onMouseLeave={() => setCategoriesMenu(false)}>
          <ModalCategory />
          <div className={css.dropdownItem} style={{ color: "#1971c2" }} onClick={handleAll}>#all articles</div>
          {categories?.map(i => (
            <div key={i?.id} className={css.dropdownItem} style={{ color: "#1971c2" }} onClick={() => setFilteredByCategory(i?.id)}>#{i?.name}</div>
          ))}
          <div className={css.dropdownItem} onClick={handleArchive}>archive</div>
        </div>
      )}
      {userMenu && (
        <div className={`${css.userDropdown} ${css.userDropdown}`} onMouseOver={() => setUserMenu(true)} onMouseLeave={() => setUserMenu(false)}>
          <div className={css.dropdownItem}>settings</div>
          <div className={css.dropdownItem}>dark theme</div>
          <div className={css.dropdownItem}>eye saver</div>
          <div className={css.dropdownItem}>striped list</div>
          <div className={`${css.dropdownItem} ${css.dropdownViewItem}`}>column view</div>
          <div className={css.dropdownItem} style={{ color: "#1971c2" }} onClick={handleSignOut}>sign out</div>
        </div>
      )}
    </div>
  );
};
