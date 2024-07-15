import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setIsModalOpenPasswordReset } from 'redux/features/app/appSlice';
import { setErrorAuthForm, createUserWithEmailAndPasswordThunk, signInWithEmailAndPasswordThunk, signInWithGoogleThunk } from 'redux/features/user/userSlice';

import { Button, Input } from 'components';
import { Reset } from './Reset/Reset';
import { Verification } from './Verification/Verification';

import css from './Auth.module.css';

import logo from 'assets/images/logo.png';
import google from 'assets/images/google.svg';

const SIGN_UP = 'Sign Up';
const SIGN_IN = 'Sign In';
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,128}$/;

export default function Auth() {
  const dispatch = useDispatch();

  const { loadingAuthForm, errorAuthForm } = useSelector(state => state.user);

  const [formType, setFormType] = useState(SIGN_IN);
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

    if (!email && !password) {
      dispatch(setErrorAuthForm('Email and password are required.'));
    }
    else if(!PASSWORD_PATTERN.test(password)) {
      dispatch(setErrorAuthForm('Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character.'));
    }
    else if (formType === SIGN_IN) {
      dispatch(signInWithEmailAndPasswordThunk({ email, password }));
    }
    else if (formType === SIGN_UP) {
      dispatch(createUserWithEmailAndPasswordThunk({ email, password }));
    }
  };

  const handleGoogle = () => dispatch(signInWithGoogleThunk());

  const handleReset = () => dispatch(setIsModalOpenPasswordReset(true));

  const handleToggle = type => {
    setFormType(type);
    setEmail('');
    setPassword('');
    setFocussedEmail('');
    setFocussedPassword('');
    dispatch(setErrorAuthForm(''));
  };

  return (
    <div className={css.container}>
      <div className={css.header}>
        <div className={css.logo}>
          <img className={css.logoImg} src={logo} alt="logo" />
          <p className={css.logoText}>Omniumicon</p>
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
            error="Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character."
            autocomplete="off"
            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,128}$"
            required={true}
            value={password}
            onChange={e => setPassword(e.target.value)}
            onBlur={handleFocus}
            dataFocussed={focussedPassword.toString()}
          />
          <Button type="submit" variant="outlined" loading={loadingAuthForm} disabled={!email || !password}>Continue with email</Button>
          {formType === SIGN_IN && <Button variant="text" loading={loadingAuthForm} onClick={handleReset}>Forgot password</Button>}
          <hr className={css.divider} />
          <Button variant="contained" icon={google} iconAlt="google" loading={loadingAuthForm} onClick={handleGoogle}>Continue with Google</Button>
        </form>
        {formType === SIGN_IN
          ? <>
            <p className={css.alternativeText}>Don't have an account?</p>
            <Button variant="text" loading={loadingAuthForm} onClick={() => handleToggle(SIGN_UP)}>Create account</Button>
          </>
          : <>
            <p className={css.alternativeText}>Already have an account?</p>
            <Button variant="text" loading={loadingAuthForm} onClick={() => handleToggle(SIGN_IN)}>Log in</Button>
          </>
        }
      </div>
      <Reset />
      <Verification />
    </div>
  );
};
