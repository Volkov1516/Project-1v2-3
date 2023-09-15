import { useState, useEffect } from 'react';
import { auth } from 'firebase.js';
import { onAuthStateChanged } from 'firebase/auth';

import { Auth } from 'components/Auth/Auth';
import { Home } from 'components/Home/Home';

export const App = () => {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;

        setIsAuth(true);
      } else {
        setIsAuth(false);
      }
    });
  }, []);

  return (
    <>
      {isAuth ? <Home /> : <Auth />}
    </>
  );
};
