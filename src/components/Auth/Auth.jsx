import { useState } from 'react';

import css from './Auth.module.css';

import logo from 'assets/logo-black.png';

export const Auth = () => {
  const [authType, setAuthType] = useState('Sing in');

  return (
    <div className={css.container}>
      <div className={css.header}>
        <div className={css.logo}>
          <img className={css.logoImg} src={logo} alt="logo image" />
          <span className={css.logoText}>Journalisto</span>
        </div>
      </div>
      <div className={css.content}>
        <div className={css.title}>{authType}</div>
        <form className={css.form}>
          <div className={css.fieldContainer}>
            <lebel className={css.fieldLebel} htmlFor="email">Email</lebel>
            <input
              className={css.fieldInput}
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              required={true}
            />
            <span className={css.fieldError}>Please, provide a correct email</span>
          </div>
          <div className={css.fieldContainer}>
            <lebel className={css.fieldLebel} htmlFor="password">Email</lebel>
            <input
              className={css.fieldInput}
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              required={true}
            />
            <span className={css.fieldError}>Please, provide a correct password</span>
          </div>
          <button type="submit">Continue with email</button>
        </form>
        <button>Continue with Google</button>
        <button>Continue with Apple</button>
        <button>Continue with Microsoft</button>
        <button>Continue with Facebook</button>
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
