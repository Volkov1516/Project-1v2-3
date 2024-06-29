import { useState } from 'react';
import { auth } from 'services/firebase.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail
} from 'firebase/auth';

import { Button, Input } from 'components';

import css from './Auth.module.css';

import logo from 'assets/images/logo.png';
import google from 'assets/images/google.svg';

import { normalizeAuthErrorMessage } from 'utils/normalizeAuthErrorMessage';

export default function Auth() {
  const [formType, setFormType] = useState('Log in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focussedEmail, setFocussedEmail] = useState(false);
  const [focussedPassword, setFocussedPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleFocus = e => {
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

  const handleToggleForm = type => {
    setEmail('');
    setPassword('');
    setFocussedEmail(false);
    setFocussedPassword(false);
    setResetEmail('');
    setResetMessage(false);
    setErrorMessage(null);
    setFormType(type);
  };

  const onSubmit = async e => {
    e.preventDefault();

    if (formType === 'Sing up') {
      await createUserWithEmailAndPassword(auth, email, password).catch(error => normalizeAuthErrorMessage(error, setErrorMessage));
    }
    else if (formType === 'Log in') {
      await signInWithEmailAndPassword(auth, email, password).catch(error => normalizeAuthErrorMessage(error, setErrorMessage));
    }
  };

  const handleGoogle = async () => {
    const provider = new GoogleAuthProvider();

    await signInWithPopup(auth, provider).catch(error => normalizeAuthErrorMessage(error, setErrorMessage));
  };

  const handleResetPassword = async () => {
    if (!resetEmail) return;

    await sendPasswordResetEmail(auth, resetEmail).then(() => setResetMessage(true)).catch(error => normalizeAuthErrorMessage(error, setErrorMessage));
  };

  return (
    <div className={css.container}>
      <div className={css.header}>
        <div className={css.logo}>
          <img className={css.logoImg} src={logo} alt="logo" />
          <span className={css.logoText}>Omniumicon</span>
        </div>
      </div>
      {formType === "Reset" ? (
        <div className={css.resetContainer}>
          <div className={css.title}>Reset Password</div>
          <div className={css.errorContainer}>{errorMessage}</div>
          <div className={css.resetForm}>
            <Input id="resetInput" type="email" placeholder="Enter your email" value={resetEmail} fullWidth onChange={(e) => setResetEmail(e.target.value)} />
            <Button variant="outlined" fullWidth disabled={!resetEmail} onClick={handleResetPassword}>Send email</Button>
          </div>
          {resetMessage && <p className={css.resetMessage}>Check your email to proceed password reset.</p>}
          <Button variant="text" onClick={() => handleToggleForm("Log in")}>Back to Login</Button>
        </div>
      ) : (
        <div className={css.authContainer}>
          <div className={css.title}>{formType}</div>
          {errorMessage && <div className={css.errorContainer}>{errorMessage}</div>}
          <form className={css.form} onSubmit={onSubmit}>
            <div className={css.fieldContainer}>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                required={true}
                autocomplete="on"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={handleFocus}
                dataFocussed={focussedEmail.toString()}
                label="Email"
                error="Invalid email address"
              />
            </div>
            <div className={css.fieldContainer}>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                required={true}
                autocomplete="on"
                pattern="[0-9a-zA-Z]{6,}"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={handleFocus}
                dataFocussed={focussedPassword.toString()}
                label="Password"
                error="Invalid password"
              />
            </div>
            <Button type="submit" variant="outlined" disabled={!email || !password}>Continue with email</Button>
            {formType === "Log in" && <Button variant="text" onClick={() => handleToggleForm("Reset")}>Forgot password</Button>}
            <hr className={css.divider} />
            <Button variant="contained" icon={google} iconAlt="google" onClick={handleGoogle}>Continue with Google</Button>
          </form>
          {formType === "Log in" ? (
            <>
              <span className={css.alternativeText}>Don't have an account?</span>
              <Button variant="text" onClick={() => handleToggleForm("Sing up")}>Create account</Button>
            </>
          ) : (
            <>
              <span className={css.alternativeText}>Already have an account?</span>
              <Button variant="text" onClick={() => handleToggleForm("Log in")}>Log in</Button>
            </>
          )}
        </div>
      )}
    </div>
  );
};
