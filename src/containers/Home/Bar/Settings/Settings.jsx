import { createPortal } from 'react-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setTheme, setSnackbar, setSettingsModal } from 'redux/features/app/appSlice';
import { setUser, updateUserName, updateUserPhoto } from 'redux/features/user/userSlice';
import { updateNotesCache, setActiveNote } from 'redux/features/note/noteSlice';
import { db, auth } from 'services/firebase.js';
import { doc, setDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

import { IconButton } from 'components/IconButton/IconButton';
import { Input } from 'components/Input/Input';
import { Switch } from 'components/Switch/Switch';
import { Button } from 'components/Button/Button';

import css from './Settings.module.css';

import { CLOSE } from 'utils/variables';
import logo from 'assets/images/logo.png';
import googlePlay from 'assets/images/google-play.svg';
import patreon from 'assets/images/patreon.svg';

export const Settings = () => {
  const dispatch = useDispatch();

  const { windowWidth, theme, settingsModal } = useSelector(state => state.app);
  const { userId, userEmail, userName, userPhoto } = useSelector(state => state.user);

  const handleChangeUserName = (e) => dispatch(updateUserName(e.target.value));

  const handleBlurUserName = async () => {
    await setDoc(doc(db, 'users', userId), { name: userName }, { merge: true });

    dispatch(setSnackbar('Name was updated'));
  };

  const handleChangeUserPhoto = (e) => dispatch(updateUserPhoto(e.target.value));

  const handleBlurUserPhoto = async () => {
    await setDoc(doc(db, 'users', userId), { photo: userPhoto }, { merge: true });

    dispatch(setSnackbar('Photo was updated'));
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

  const handleLogOut = async () => {
    try {
      await signOut(auth);

      localStorage.removeItem('theme');

      dispatch(setUser(null, null, null, null, null));
      dispatch(updateNotesCache(null));
      dispatch(setActiveNote({
        isNew: null,
        id: null,
        title: null,
        content: null,
      }));
    } catch (error) {
      dispatch(setSnackbar('Faild to log out'));
    }
  };

  const handleClose = () => windowWidth < 639 ? window.history.back() : dispatch(setSettingsModal(false));

  return settingsModal && createPortal(
    <div className={css.container} onClick={handleClose}>
      <div className={css.content} onClick={e => e.stopPropagation()}>
        <nav className={css.navigation}>
          <IconButton onClick={handleClose} path={CLOSE} />
        </nav>
        <div className={css.sections}>
          <section className={css.section}>
            <div className={css.sectionName}>Account</div>
            <div className={css.accountGroup}>
              <img src={userPhoto} alt="avatar" className={css.photo} />
              <div className={css.accoutSettings}>
                <div className={css.accoutSettingsField}><span className={css.emailLabel}>Email</span> {userEmail}</div>
                <Input id="userNameInput" label="Name" value={userName} onChange={e => handleChangeUserName(e)} onBlur={handleBlurUserName} />
                <Input id="userPhotoInput" label="Photo URL" value={userPhoto} onChange={e => handleChangeUserPhoto(e)} onBlur={handleBlurUserPhoto} />
              </div>
            </div>
          </section>
          <section className={css.section}>
            <div className={css.sectionName}>Appearance</div>
            <div className={css.themeField}>
              <span>Dark theme</span>
              <Switch checked={theme === "dark" ? true : false} onChange={handleSwitchTheme} />
            </div>
          </section>
          <section className={css.section}>
            <div className={css.sectionName}>Links</div>
            <Button variant="outlined" icon={logo} iconAlt="website">Website</Button>
            <Button variant="outlined" icon={googlePlay} iconAlt="google play">Google Play</Button>
            <Button variant="outlined" icon={patreon} iconAlt="patreon">Patreon</Button>
          </section>
          <section className={css.section}>
            <div className={css.sectionName}>Updates</div>
            <span>Version: 0.1</span>
            <b>What's new:</b>
            <ul className={css.list}>
              <li>Beta release!</li>
            </ul>
            <b>Future updates:</b>
            <ul className={css.list}>
              <li>Link</li>
              <li>Image</li>
              <li>Video</li>
              <li>Code Block</li>
            </ul>
          </section>
          <section className={css.section}>
            <div className={css.sectionName}>Contacts</div>
            <div>volkov.x@outlook.com</div>
          </section>
          <section className={css.section}>
            <Button variant="contained" onClick={handleLogOut}>Log out</Button>
          </section>
        </div>
      </div>
    </div>,
    document.body
  );
};
