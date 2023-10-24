import { useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { SET_CURRENT_ID, SET_CONTENT, SET_FILTERED_ARTICLES, SET_TITLE, SET_CURRENT_INDEX } from 'redux/features/article/articleSlice';
import { SET_MODAL_EDITOR_EMPTY } from 'redux/features/modal/modalSlice';

import { auth } from 'firebase.js';
import { signOut } from 'firebase/auth';

import { v4 as uuidv4 } from 'uuid';

import css from './Header.module.css';

import Button from 'components/atoms/Button/Button';
import { ModalEditor } from 'components/molecules/ModalEditor/ModalEditor';
import { ModalCategory } from '../ModalCategory/ModalCategory';

export const Header = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector(state => state.user);
  const { originalArticles } = useSelector(state => state.article);
  const { modalEditorEmpty } = useSelector(state => state.modal);
  const EMPTY_CONTENT = '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}';

  const [categoriesMenu, setCategoriesMenu] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [titleState, setTitleState] = useState('');

  const openModalEditor = () => {
    window.history.pushState({ modalEditorEmpty: 'opened' }, '', '#editor');

    const newId = uuidv4();
    dispatch(SET_CURRENT_ID(newId));
    dispatch(SET_CURRENT_INDEX(null));
    dispatch(SET_TITLE(''));
    dispatch(SET_CONTENT(EMPTY_CONTENT));
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
    const unarchived = originalArticles?.filter(i => !i?.data()?.archive);
    dispatch(SET_FILTERED_ARTICLES(unarchived));
  };

  const handleArchive = () => {
    const archive = originalArticles?.filter(i => i?.data()?.archive);
    dispatch(SET_FILTERED_ARTICLES(archive));
  };

  const setFilteredByCategory = (id) => {
    const unarchived = originalArticles?.filter(i => !i?.data()?.archive);
    let newArr = [];

    unarchived?.map(i => i.data()?.categories?.map(j => {
      if (j.id === id) {
        return newArr.push(i);
      }
      else {
        return i;
      }
    }));

    dispatch(SET_FILTERED_ARTICLES(newArr));
  };

  return (
    <div className={css.container}>
      <div className={css.left}>
        <ModalEditor
          openElement={<Button variant="contained" size="large" onClick={openModalEditor}>CREATE</Button>}
          modalEditorStatus={modalEditorEmpty}
          setModalEditorStatus={() => dispatch(SET_MODAL_EDITOR_EMPTY(false))}
          titleState={titleState}
          setTitleState={setTitleState}
          autofocus={true}
        />
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
