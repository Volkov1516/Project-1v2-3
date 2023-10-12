import { useState, useEffect } from 'react';
import { auth } from 'firebase.js';
import { onAuthStateChanged } from 'firebase/auth';

import { Auth } from 'components/templates/Auth/Auth';
import { Home } from 'components/templates/Home/Home';
import { Loading } from 'components/templates/Loading/Loading';

import { db } from 'firebase.js';
import { collection, query, where, getDocs } from "firebase/firestore";

export const App = () => {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const getArticles = async (res) => {
      const q = query(collection(db, 'articles'), where('userId', '==', res?.uid));
      const querySnapshot = await getDocs(q);

      setArticles(querySnapshot.docs);
    }

    onAuthStateChanged(auth, (res) => {
      if (res) {
        setIsAuth(true);
        setLoading(false);
        setUser(res);
        getArticles(res);
      } else {
        setIsAuth(false);
        setLoading(false);
      }
    });
  }, []);

  return loading ? <Loading /> : isAuth ? <Home user={user} articles={articles} /> : <Auth />;
};
