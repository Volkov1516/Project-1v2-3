import { useState } from 'react';

import { SignUp } from './SignUp/SignUp';
import { SignIn } from './SignIn/SignIn';
import { Reset } from './Reset/Reset';
import { Verification } from './Verification/Verification';

import css from './Auth.module.css';

import logo from 'assets/images/logo.png';

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className={css.container}>
      <div className={css.header}>
        <div className={css.logo}>
          <img className={css.logoImg} src={logo} alt="logo" />
          <span className={css.logoText}>Omniumicon</span>
        </div>
      </div>
      {isSignUp ? <SignUp setIsSignUp={setIsSignUp} /> : <SignIn setIsSignUp={setIsSignUp} />}
      <Reset />
      <Verification />
    </div>
  );
};
