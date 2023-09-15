import { useState } from 'react';
import { auth } from 'firebase.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';

import css from './Auth.module.css';
import logo from 'assets/logo-black.png';

export const Auth = () => {
  const [authType, setAuthType] = useState('Sing in');
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();

    if (authType === 'Sing up') {
      await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log(user);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
        });
    }
    else if (authType === 'Sing in') {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log(user);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
        });
    }
  };

  const handleGoogle = async () => {
    const provider = new GoogleAuthProvider();

    await signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        console.log(token);

        const user = result.user;
        console.log(user);
      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);

        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log(email, credential);
      });
  };

  return (
    <div className={css.container}>
      <div className={css.header}>
        <div className={css.logo}>
          <img className={css.logoImg} src={logo} alt="logo" />
          <span className={css.logoText}>Journalisto</span>
        </div>
      </div>
      <div className={css.content}>
        <div className={css.title}>{authType}</div>
        <form className={css.form}>
          <div className={css.fieldContainer}>
            <label className={css.fieldLebel} htmlFor="email">Email</label>
            <input
              className={css.fieldInput}
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              required={true}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <span className={css.fieldError}>Please, provide a correct email</span>
          </div>
          <div className={css.fieldContainer}>
            <label className={css.fieldLebel} htmlFor="password">Email</label>
            <input
              className={css.fieldInput}
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              required={true}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className={css.fieldError}>Please, provide a correct password</span>
          </div>
          <button type="submit" onClick={onSubmit}>Continue with email</button>
        </form>
        <button onClick={handleGoogle}>Continue with Google</button>
        {authType === 'Sing in'
          ? <>
            <span>Don't have an account?</span>
            <button onClick={() => setAuthType('Sing up')}>Create account</button>
          </>
          : <>
            <span>Already have an account?</span>
            <button onClick={() => setAuthType('Sing in')}>Sign in</button>
          </>
        }
      </div>
    </div>
  );
};
