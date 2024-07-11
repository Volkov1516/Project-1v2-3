import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setIsModalOpenPasswordReset } from 'redux/features/app/appSlice';
import { createUserWithEmailAndPasswordThunk, signInWithEmailAndPasswordThunk, signInWithGoogleThunk } from 'redux/features/user/userSlice';

import { Button, Input } from 'components';
import { Reset } from './Reset/Reset';
import { Verification } from './Verification/Verification';

import css from './Auth.module.css';

import logo from 'assets/images/logo.png';
import google from 'assets/images/google.svg';

export default function Auth() {
  const dispatch = useDispatch();

  const { loadingAuthForm, errorAuthForm } = useSelector(state => state.user);

  const [formType, setFormType] = useState('Sign In');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focussedEmail, setFocussedEmail] = useState(false);
  const [focussedPassword, setFocussedPassword] = useState(false);

  const handleFocus = e => {
    switch (e.target.name) {
      case 'email':
        email && setFocussedEmail(true);
        break;
      case 'password':
        password && setFocussedPassword(true);
        break;
      default:
        return;
    }
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (!email && !password) return;

    if (formType === 'Sing In') {
      dispatch(signInWithEmailAndPasswordThunk({ email, password }));
    }
    else if (formType === 'Sign Up') {
      dispatch(createUserWithEmailAndPasswordThunk({ email, password }));
    }
  };

  const handleGoogle = () => dispatch(signInWithGoogleThunk());

  const handleReset = () => dispatch(setIsModalOpenPasswordReset(true));

  const handleToggleForm = (type) => {
    setFormType(type);
    setEmail('');
    setPassword('');
    setFocussedEmail('');
    setFocussedPassword('');
  };

  return (
    <div className={css.container}>
      <div className={css.header}>
        <div className={css.logo}>
          <img className={css.logoImg} src={logo} alt="logo" />
          <span className={css.logoText}>Omniumicon</span>
        </div>
      </div>
      <div className={css.content}>
        <p className={css.typeText}>{formType}</p>
        {errorAuthForm && <p className={css.errorText}>{errorAuthForm}</p>}
        <form className={css.form} onSubmit={handleSubmit}>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            label="Email"
            error="Invalid email address"
            autocomplete="on"
            required={true}
            value={email}
            onChange={e => setEmail(e.target.value)}
            onBlur={handleFocus}
            dataFocussed={focussedEmail.toString()}
          />
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            label="Password"
            error="Invalid password"
            autocomplete="on"
            pattern="[0-9a-zA-Z]{6,}"
            required={true}
            value={password}
            onChange={e => setPassword(e.target.value)}
            onBlur={handleFocus}
            dataFocussed={focussedPassword.toString()}
          />
          <Button type="submit" variant="outlined" loading={loadingAuthForm} disabled={!email || !password}>Continue with email</Button>
          {formType === "Sign In" && <Button variant="text" onClick={handleReset}>Forgot password</Button>}
          <hr className={css.divider} />
          <Button variant="contained" icon={google} iconAlt="google" disabled={loadingAuthForm} onClick={handleGoogle}>Continue with Google</Button>
        </form>
        {formType === "Sign In"
          ? <>
            <span className={css.alternativeText}>Don't have an account?</span>
            <Button variant="text" onClick={() => handleToggleForm("Sign Up")}>Create account</Button>
          </>
          : <>
            <p className={css.alternativeText}>Already have an account?</p>
            <Button variant="text" onClick={() => handleToggleForm("Sign In")}>Log in</Button>
          </>
        }
      </div>
      <Reset />
      <Verification />
    </div>
  );
};
