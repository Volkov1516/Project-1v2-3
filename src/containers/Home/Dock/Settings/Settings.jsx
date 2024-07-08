import { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setTheme, setModalGlobalSettings } from 'redux/features/app/appSlice';
import { updateUserName, signOutThunk, updateUserPhotoThunk, updateUserNameThunk } from 'redux/features/user/userSlice';

import { Avatar, Button, Input, Modal, Switch } from 'components';

import css from './Settings.module.css';

import logo from 'assets/images/logo.png';
import googlePlay from 'assets/images/google-play.svg';
import patreon from 'assets/images/patreon.svg';

export const Settings = () => {
  const dispatch = useDispatch();

  const { windowWidth, theme, modalGlobalSettings } = useSelector(state => state.app);
  const { userId, userEmail, userName, userPhoto } = useSelector(state => state.user);

  const fileInputRef = useRef(null);

  const [initialUserName, setInitialUserName] = useState('');

  const handleImageChange = e => {
    if (e.target.files[0]) {
      dispatch(updateUserPhotoThunk({ id: userId, file: e.target.files[0] }));
    }
  };

  const handleChangeUserName = e => dispatch(updateUserName(e.target.value));

  const handleFocusUserName = e => setInitialUserName(e.target.value);

  const handleBlurUserName = () => {
    if (initialUserName === userName) return;

    dispatch(updateUserNameThunk({ displayName: userName }));
  };

  const handleSwitchTheme = () => {
    const body = document.body;

    if (theme === 'light') {
      localStorage.setItem('theme', 'dark');
      dispatch(setTheme('dark'));

      body.classList.remove('light-theme');
      body.classList.add('dark-theme');

      const themeTag = document.querySelector('meta[name="theme-color"]');
      themeTag.setAttribute('content', '#191919');
    }
    else if (theme === 'dark') {
      localStorage.setItem('theme', 'light');
      dispatch(setTheme('light'));

      body.classList.remove('dark-theme');
      body.classList.add('light-theme');

      const themeTag = document.querySelector('meta[name="theme-color"]');
      themeTag.setAttribute('content', '#FFFFFF');
    }
  };

  const handleLogOut = () => dispatch(signOutThunk());

  const handleClose = () => windowWidth <= 480 ? window.history.back() : dispatch(setModalGlobalSettings(false));

  return (
    <Modal open={modalGlobalSettings} close={handleClose} fullWidth={true}>
      <div className={css.sections}>
        <section className={css.section}>
          <div className={css.accountGroup}>
            <Avatar src={userPhoto} alt="avatar" size="large" />
            <div className={css.accoutSettings}>
              <div className={css.accoutSettingsField}>
                <span className={css.emailLabel}>Email</span>
                <span className={css.emailText}>{userEmail}</span>
              </div>
              <Input id="userNameInput" label="Name" value={userName || ""} onChange={e => handleChangeUserName(e)} onFocus={handleFocusUserName} onBlur={handleBlurUserName} onEnter={handleBlurUserName} />
              <Button variant="outlined" onClick={() => fileInputRef.current.click()}>Upload New Photo</Button>
              <input ref={fileInputRef} className={css.fileInputRef} type="file" name="avatar" accept="image/*" onChange={handleImageChange} />
            </div>
          </div>
        </section>
        <section className={css.section}>
          <div className={css.themeField}>
            <span>Dark theme</span>
            <Switch id="switchTheme" checked={theme === "dark" ? true : false} onChange={handleSwitchTheme} />
          </div>
        </section>
        <section className={css.section}>
          <Button variant="outlined" icon={logo} iconAlt="website">Website</Button>
          <Button variant="outlined" icon={googlePlay} iconAlt="google play">Google Play</Button>
          <Button variant="outlined" icon={patreon} iconAlt="patreon">Patreon</Button>
        </section>
        <section className={css.section}>
          <Button variant="contained" onClick={handleLogOut}>Log out</Button>
        </section>
      </div>
    </Modal>
  );
};
