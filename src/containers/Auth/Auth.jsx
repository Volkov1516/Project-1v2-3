import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createUserWithEmailAndPasswordThunk,
  signInWithEmailAndPasswordThunk,
  signInWithGoogleThunk,
  sendPasswordResetEmailThunk
} from 'redux/features/user/userSlice';

import { Button, Input } from 'components';

import css from './Auth.module.css';

import logo from 'assets/images/logo.png';
import google from 'assets/images/google.svg';

export default function Auth() {
  const dispatch = useDispatch();

  const { authFormLoading, authFormError, isShowEmailVerificationMessage } = useSelector(state => state.user);

  const [formType, setFormType] = useState('Log in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focussedEmail, setFocussedEmail] = useState(false);
  const [focussedPassword, setFocussedPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState(false);

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
    setFormType(type);
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (formType === 'Sing up') {
      dispatch(createUserWithEmailAndPasswordThunk({ email, password }));
    }
    else if (formType === 'Log in') {
      dispatch(signInWithEmailAndPasswordThunk({ email, password }));
    }
  };

  const handleGoogle = () => dispatch(signInWithGoogleThunk());

  const handleResetPassword = () => {
    if (!resetEmail) return;

    dispatch(sendPasswordResetEmailThunk({ resetEmail }));

    setResetMessage(true);
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
          <div className={css.errorContainer}>{authFormError}</div>
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
          {authFormError && <div className={css.errorContainer}>{authFormError}</div>}
          {isShowEmailVerificationMessage && <div className={css.errorContainer}>Not verified!</div>}
          <form className={css.form} onSubmit={handleSubmit}>
            <div className={css.fieldContainer}>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                required={true}
                autocomplete="on"
                value={email}
                onChange={e => setEmail(e.target.value)}
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
                onChange={e => setPassword(e.target.value)}
                onBlur={handleFocus}
                dataFocussed={focussedPassword.toString()}
                label="Password"
                error="Invalid password"
              />
            </div>
            <Button type="submit" variant="outlined" loading={authFormLoading} disabled={!email || !password}>Continue with email</Button>
            {formType === "Log in" && <Button variant="text" onClick={() => handleToggleForm("Reset")}>Forgot password</Button>}
            <hr className={css.divider} />
            <Button variant="contained" icon={google} iconAlt="google" loading={authFormLoading} onClick={handleGoogle}>Continue with Google</Button>
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
