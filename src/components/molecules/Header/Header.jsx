import { useState } from 'react';

import { auth } from 'firebase.js';
import { signOut } from 'firebase/auth';

import css from './Header.module.css';

import Button  from 'components/atoms/Button/Button';
import { ModalEditor } from 'components/molecules/ModalEditor/ModalEditor';

export const Header = () => {
  const [open, setOpen] = useState(false);

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
        <Button variant="text" onClick={() => setOpen(!open)} onMouseOver={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>all articles</Button>
        <Button variant="text">search</Button>
      </div>
      <div className={css.right}>
        <Button variant="text">settings</Button>
        <Button variant="text" onClick={handleSignOut}>signout</Button>
      </div>
      {open && (
        <div className={css.dropdown} onMouseOver={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
          <div className={css.dropdownItem}>add category</div>
          <div className={css.dropdownItem}>all articles</div>
          <div className={css.dropdownItem} style={{ color: "#1971c2" }}>#goals</div>
          <div className={css.dropdownItem} style={{ color: "#1971c2" }}>#projects</div>
          <div className={css.dropdownItem} style={{ width: "fit-content", color: "white", backgroundColor: "#e03131", paddingRight: "12px" }}>red</div>
          <div className={css.dropdownItem} style={{ width: "fit-content", color: "white", backgroundColor: "#1971c2", paddingRight: "12px" }}>blue</div>
          <div className={css.dropdownItem}>trash</div>
        </div>
      )}
    </div>
  );
};
