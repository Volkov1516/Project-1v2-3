import { useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { SET_CURRENT_ID, SET_CONTENT, SET_FILTERED_ARTICLES, SET_TITLE, SET_CURRENT_INDEX } from 'redux/features/article/articleSlice';

import { v4 as uuidv4 } from 'uuid';

import { auth } from 'firebase.js';
import { signOut } from 'firebase/auth';

import css from './Header.module.css';

import Button from 'components/atoms/Button/Button';
import { ModalEditor } from 'components/molecules/ModalEditor/ModalEditor';

export const Header = () => {
  const dispatch = useDispatch();
  const { originalArticles } = useSelector(state => state.article);
  const EMPTY_CONTENT = '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}';

  const [categoriesMenu, setCategoriesMenu] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [modalEditorStatus, setModalEditorStatus] = useState(false);
  const [titleState, setTitleState] = useState('');

  const openModalEditor = () => {
    const newId = uuidv4();
    dispatch(SET_CURRENT_ID(newId));
    dispatch(SET_CURRENT_INDEX(null));
    dispatch(SET_TITLE(''));
    dispatch(SET_CONTENT(EMPTY_CONTENT));
    setModalEditorStatus(true);
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

  return (
    <div className={css.container}>
      <div className={css.left}>
        <ModalEditor
          openElement={<Button variant="contained" size="large" onClick={openModalEditor}>CREATE</Button>}
          modalEditorStatus={modalEditorStatus}
          setModalEditorStatus={setModalEditorStatus}
          titleState={titleState}
          setTitleState={setTitleState}
        />
        <Button
          variant="text"
          onClick={() => setCategoriesMenu(!categoriesMenu)}
          onMouseOver={() => setCategoriesMenu(true)}
          onMouseLeave={() => setCategoriesMenu(false)}
        >
          all articles
        </Button>
        <div className={css.serachBtn}><Button variant="text">search</Button></div>
      </div>
      <div className={css.right}>
        <Button variant="text" onClick={() => setUserMenu(!userMenu)} onMouseOver={() => setUserMenu(true)} onMouseLeave={() => setUserMenu(false)}>user</Button>
      </div>
      {categoriesMenu && (
        <div className={css.dropdown} onMouseOver={() => setCategoriesMenu(true)} onMouseLeave={() => setCategoriesMenu(false)}>
          <div className={css.dropdownItem}>add category</div>
          <div className={css.dropdownItem} onClick={handleAll}>all articles</div>
          <div className={css.dropdownItem} style={{ color: "#1971c2" }}>#goals</div>
          <div className={css.dropdownItem} style={{ color: "#1971c2" }}>#projects</div>
          <div className={css.dropdownItem} style={{ width: "fit-content", color: "white", backgroundColor: "#e03131", paddingRight: "12px" }}>red</div>
          <div className={css.dropdownItem} style={{ width: "fit-content", color: "white", backgroundColor: "#1971c2", paddingRight: "12px" }}>blue</div>
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
