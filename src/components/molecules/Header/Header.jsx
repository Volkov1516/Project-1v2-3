import { auth } from 'firebase.js';
import { signOut } from 'firebase/auth';

import css from './Header.module.css';

import { Button } from 'components/atoms/Button/Button';

export const Header = () => {
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
        <Button variant="contained" size="large">CREATE</Button>
        <Button variant="text">categories</Button>
        <Button variant="text">search</Button>
      </div>
      <div className={css.right}>
      <Button variant="text">settings</Button>
      <Button variant="text" onClick={handleSignOut}>signout</Button>
      </div>
    </div>
  );
};
