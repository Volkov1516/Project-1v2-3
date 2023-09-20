import { useState } from 'react';
import { auth } from 'firebase.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';

import { Input } from 'components/atoms/Input/Input';
import Button from 'components/atoms/Button/Button';

import css from './Auth.module.css';
import logo from 'assets/logo.png';
import google from 'assets/google.svg'

export const Auth = () => {
  const [authType, setAuthType] = useState('Log in');
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('');
  const [focussedEmail, setFocussedEmail] = useState(false);
  const [focussedPassword, setFocussedPassword] = useState(false);

  const handleFocus = (e) => {
    switch (e.target.name) {
      case 'email':
        setFocussedEmail(true);
        break;
      case 'password':
        setFocussedPassword(true);
        break;
      default:
        return;
    }
  };

  const handleToggleAuth = (type) => {
    setEmail('');
    setPassword('');
    setFocussedEmail(false);
    setFocussedPassword(false);
    setAuthType(type);
  };

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
    else if (authType === 'Log in') {
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
              variant="contained"
              id="email"
              name="email"
              type="email"
              label="Email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={handleFocus}
              dataFocussed={focussedEmail.toString()}
              error="Invalid email address"
            />
          </div>
          <div className={css.fieldContainer}>
            <Input
              variant="contained"
              id="password"
              name="password"
              type="password"
              label="Password"
              placeholder="Enter your password"
              pattern="[0-9a-zA-Z]{6,}"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={handleFocus}
              dataFocussed={focussedPassword.toString()}
              error="Password must contain minimum 6 characters"
            />
          </div>
          <Button type="submit" variant="contained">Continue with email</Button>
          <hr className={css.divider} />
          <Button variant="outlined" onClick={handleGoogle}><img className={css.buttonImg} src={google} alt="google" />Continue with Google</Button>
        </form>
        {authType === "Log in"
          ? <>
            <span className={css.alternativeText}>Don't have an account?</span>
            <Button variant="text" onClick={() => handleToggleAuth("Sing up")}>Create account</Button>
          </>
          : <>
            <span className={css.alternativeText}>Already have an account?</span>
            <Button variant="text" onClick={() => handleToggleAuth("Log in")}>Log in</Button>
          </>
        }
      </div>
    </div>
  );
};
