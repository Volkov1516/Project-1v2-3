import { useState } from 'react';
import { auth } from 'firebase.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';

import { Input } from 'components/atoms/Input/Input';

import css from './Auth.module.css';
import logo from 'assets/logo.png';
import google from 'assets/google.svg'

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
        <form className={css.form} onSubmit={onSubmit}>
          <div className={css.fieldContainer}>
            <Input
              id="email"
              name="email"
              type="email"
              label="Email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <span className={css.fieldError}>Please, provide a correct email</span>
          </div>
          <div className={css.fieldContainer}>
            <Input
              id="password"
              name="password"
              type="password"
              label="Password"
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className={css.fieldError}>Please, provide a correct password</span>
          </div>
          <button type="submit">Continue with email</button>
        </form>
        <button onClick={handleGoogle}><img className={css.buttonImg} src={google} alt="google" />Continue with Google</button>
        {authType === "Sing in"
          ? <>
            <span className={css.alternativeText}>Don't have an account?</span>
            <button onClick={() => setAuthType("Sing up")}>Create account</button>
          </>
          : <>
            <span className={css.alternativeText}>Already have an account?</span>
            <button onClick={() => setAuthType("Sing in")}>Sign in</button>
          </>
        }
      </div>
    </div>
  );
};
