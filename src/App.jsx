import { useState, useEffect } from 'react';
import { auth } from 'firebase.js';
import { onAuthStateChanged } from 'firebase/auth';

import { Auth } from 'components/templates/Auth/Auth';
import { Home } from 'components/templates/Home/Home';
import { Loading } from 'components/templates/Loading/Loading';

export const App = () => {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuth(true);
        setLoading(false);
      } else {
        setIsAuth(false);
        setLoading(false);
      }
    });
  }, []);

  return loading ? <Loading /> : isAuth ? <Home /> : <Auth />;
};
