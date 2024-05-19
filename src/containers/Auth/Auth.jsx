import { useState } from 'react';
import { auth } from 'services/firebase.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail
} from 'firebase/auth';

import { Button } from 'components/Button/Button';

import css from './Auth.module.css';

import logo from 'assets/images/logo.png';
import google from 'assets/images/google.svg';

export const Auth = () => {
  const [authType, setAuthType] = useState('Log in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focussedEmail, setFocussedEmail] = useState(false);
  const [focussedPassword, setFocussedPassword] = useState(false);
  const [reset, setReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

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
    setErrorMessage(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (authType === 'Sing up') {
      await createUserWithEmailAndPassword(auth, email, password)
        .catch((error) => {
          const errorCode = error.code;
          const normalizedMessage = errorCode?.slice(5).split('-').join(' ');
          const firstLetterToUpperCase = normalizedMessage.charAt(0).toUpperCase() + normalizedMessage.slice(1);
          setErrorMessage(firstLetterToUpperCase);
        });
    }
    else if (authType === 'Log in') {
      signInWithEmailAndPassword(auth, email, password)
        .catch((error) => {
          const errorCode = error.code;
          const normalizedMessage = errorCode?.slice(5).split('-').join(' ');
          const firstLetterToUpperCase = normalizedMessage.charAt(0).toUpperCase() + normalizedMessage.slice(1);
          setErrorMessage(firstLetterToUpperCase);
        });
    }
  };

  const handleGoogle = async () => {
    const provider = new GoogleAuthProvider();

    await signInWithPopup(auth, provider)
      .catch((error) => {
        const errorCode = error.code;
        const normalizedMessage = errorCode?.slice(5).split('-').join(' ');
        const firstLetterToUpperCase = normalizedMessage.charAt(0).toUpperCase() + normalizedMessage.slice(1);
        setErrorMessage(firstLetterToUpperCase);
      });
  };

  const handleResetPassword = async () => {
    if (!resetEmail) return;

    await sendPasswordResetEmail(auth, resetEmail)
      .then(() => setResetMessage(true))
      .catch(error => {
        const errorCode = error.code;
        const normalizedMessage = errorCode?.slice(5).split('-').join(' ');
        const firstLetterToUpperCase = normalizedMessage.charAt(0).toUpperCase() + normalizedMessage.slice(1);
        setErrorMessage(firstLetterToUpperCase);
      });
  };

  const handleOpenReset = () => {
    setErrorMessage(null);
    setReset(true);
  };

  const handleCloseReset = () => {
    setResetEmail('');
    setResetMessage(false);
    setReset(false);
    setErrorMessage(null);
  };

  return (
    <div className={css.container}>
      <div className={css.header}>
        <div className={css.logo}>
          <img className={css.logoImg} src={logo} alt="logo" />
          <span className={css.logoText}>Journal X</span>
        </div>
      </div>
      {!reset ?
        (
          <div className={css.content}>
            <div className={css.title}>{authType}</div>
            <div className={css.errorContainer}>{errorMessage}</div>
            <form className={css.form} onSubmit={onSubmit}>
              <div className={css.fieldContainer}>
                <label className={css.label} htmlFor="email">Email</label>
                <input
                  className={css.input}
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={handleFocus}
                  data-focussed={focussedEmail.toString()}
                  error="Invalid email address"
                />
                <span className={css.error}>Invalid email address</span>
              </div>
              <div className={css.fieldContainer}>
                <label className={css.label} htmlFor="password">Password</label>
                <input
                  className={css.input}
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  pattern="[0-9a-zA-Z]{6,}"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={handleFocus}
                  data-focussed={focussedPassword.toString()}
                />
                <span className={css.error}>Password must contain minimum 6 characters</span>
              </div>
              <Button type="contained" submit>Continue with email</Button>
              {authType === "Log in" && <Button type="outlined" onClick={handleOpenReset}>Forgot password</Button>}
              <hr className={css.divider} />
              <Button type="outlined" onClick={handleGoogle}><img className={css.buttonImg} src={google} alt="google" />Continue with Google</Button>
            </form>
            {authType === "Log in"
              ? <>
                <span className={css.alternativeText}>Don't have an account?</span>
                <Button type="outlined" onClick={() => handleToggleAuth("Sing up")}>Create account</Button>
              </>
              : <>
                <span className={css.alternativeText}>Already have an account?</span>
                <Button type="outlined" onClick={() => handleToggleAuth("Log in")}>Log in</Button>
              </>
            }
          </div>
        )
        :
        (
          <div className={css.forgotPasswordContainer}>
            <div className={css.title}>Reset Password</div>
            <div className={css.errorContainer}>{errorMessage}</div>
            <div className={css.resetForm}>
              <input className={css.input} type="email" placeholder="Enter your email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} />
              <Button type="contained" onClick={handleResetPassword}>Send email</Button>
            </div>
            {resetMessage && <p className={css.resetMessage}>Check your email to proceed password reset.</p>}
            <Button type="outlined" onClick={handleCloseReset}>Back to Login</Button>
          </div>
        )
      }
    </div>
  );
};
