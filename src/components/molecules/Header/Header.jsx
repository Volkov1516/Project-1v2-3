import { useState } from 'react';

import { auth } from 'firebase.js';
import { signOut } from 'firebase/auth';

import css from './Header.module.css';

import Button from 'components/atoms/Button/Button';
import { ModalEditor } from 'components/molecules/ModalEditor/ModalEditor';

export const Header = () => {
  const [categoriesMenu, setCategoriesMenu] = useState(false);
  const [userMenu, setUserMenu] = useState(false);

  const handleSignOut = () => {
    signOut(auth).then(() => {
      console.log('Signed out successfully');
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });
  };

  return (
    <div className={css.container}>
      <div className={css.left}>
        <ModalEditor />
        <Button variant="text" onClick={() => setCategoriesMenu(!categoriesMenu)} onMouseOver={() => setCategoriesMenu(true)} onMouseLeave={() => setCategoriesMenu(false)}>all articles</Button>
        <div className={css.serachBtn}><Button variant="text">search</Button></div>
      </div>
      <div className={css.right}>
        <Button variant="text" onClick={() => setUserMenu(!userMenu)} onMouseOver={() => setUserMenu(true)} onMouseLeave={() => setUserMenu(false)}>user</Button>
      </div>
      {categoriesMenu && (
        <div className={css.dropdown} onMouseOver={() => setCategoriesMenu(true)} onMouseLeave={() => setCategoriesMenu(false)}>
          <div className={css.dropdownItem}>add category</div>
          <div className={css.dropdownItem}>all articles</div>
          <div className={css.dropdownItem} style={{ color: "#1971c2" }}>#goals</div>
          <div className={css.dropdownItem} style={{ color: "#1971c2" }}>#projects</div>
          <div className={css.dropdownItem} style={{ width: "fit-content", color: "white", backgroundColor: "#e03131", paddingRight: "12px" }}>red</div>
          <div className={css.dropdownItem} style={{ width: "fit-content", color: "white", backgroundColor: "#1971c2", paddingRight: "12px" }}>blue</div>
          <div className={css.dropdownItem}>trash</div>
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
