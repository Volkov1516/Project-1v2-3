import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createUserWithEmailAndPasswordThunk, signInWithGoogleThunk } from 'redux/features/user/userSlice';

import css from './SignUp.module.css';

import { Button, Input } from 'components';

import google from 'assets/images/google.svg';

export const SignUp = ({ setIsSignUp }) => {
  const dispatch = useDispatch();

  const { loadingAuthForm, errorAuthForm } = useSelector(state => state.user);

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

    dispatch(createUserWithEmailAndPasswordThunk({ email, password }));
  };

  const handleGoogle = () => dispatch(signInWithGoogleThunk());

  const handleToggleForm = () => setIsSignUp(false);

  return (
    <div className={css.container}>
      <p className={css.typeText}>Sign Up</p>
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
        <hr className={css.divider} />
        <Button variant="contained" icon={google} iconAlt="google" disabled={loadingAuthForm} onClick={handleGoogle}>Continue with Google</Button>
      </form>
      <p className={css.alternativeText}>Already have an account?</p>
      <Button variant="text" onClick={handleToggleForm}>Log in</Button>
    </div>
  );
};
