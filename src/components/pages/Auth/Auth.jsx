import { useState } from 'react';
import { auth } from 'firebase.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail
} from 'firebase/auth';

import css from './Auth.module.css';

import logo from 'assets/logo.png';
import google from 'assets/google.svg';

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
              <button className={css.submitBtn} type="submit">Continue with email</button>
              {authType === "Log in" && <button className={css.forgotPasswordButton} onClick={handleOpenReset}>Forgot password</button>}
              <hr className={css.divider} />
              <button className={css.googleBtn} onClick={handleGoogle}><img className={css.buttonImg} src={google} alt="google" />Continue with Google</button>
            </form>
            {authType === "Log in"
              ? <>
                <span className={css.alternativeText}>Don't have an account?</span>
                <button className={css.toggleBtn} onClick={() => handleToggleAuth("Sing up")}>Create account</button>
              </>
              : <>
                <span className={css.alternativeText}>Already have an account?</span>
                <button className={css.toggleBtn} onClick={() => handleToggleAuth("Log in")}>Log in</button>
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
              <button className={css.resetButton} onClick={handleResetPassword}>Send email</button>
            </div>
            {resetMessage && <p className={css.resetMessage}>Check your email to proceed password reset.</p>}
            <button className={css.resetBackButton} onClick={handleCloseReset}>Back to Login</button>
          </div>
        )
      }
    </div>
  );
};