import { createPortal } from 'react-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setTheme, setSnackbar } from 'redux/features/app/appSlice';
import { setUser, updateUserName, updateUserPhoto } from 'redux/features/user/userSlice';
import { updateNotesCache, setActiveNote } from 'redux/features/note/noteSlice';
import { db, auth } from 'firebase.js';
import { doc, setDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

import { IconButton } from 'components/atoms/IconButton/IconButton';
import { Input } from 'components/atoms/Input/Input';
import { Switch } from 'components/atoms/Switch/Switch';
import { Button } from 'components/atoms/Button/Button';

import css from './Settings.module.css';

import logo from '../../../../../assets/logo.png';
import googlePlay from '../../../../../assets/google-play.svg';
import patreon from '../../../../../assets/patreon.svg';

export const Settings = ({ open, setOpen }) => {
  const dispatch = useDispatch();

  const { theme } = useSelector(state => state.app);
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
    }
    else if (theme === 'dark') {
      localStorage.setItem('theme', 'light');
      dispatch(setTheme('light'));

      body.classList.remove('dark-theme');
      body.classList.add('light-theme');
    }
  };

  const handleLogOut = async () => {
    try {
      await signOut(auth);

      const body = document.body;

      body.classList.remove('dark-theme');
      body.classList.remove('light-theme');

      localStorage.removeItem('theme');

      dispatch(setTheme(null));
      dispatch(setUser(null, null, null, null, null));
      dispatch(updateNotesCache(null));
      dispatch(setActiveNote({
        isOpen: null,
        isNew: null,
        id: null,
        title: null,
        content: null,
      }));
    } catch (error) {
      dispatch(setSnackbar('Faild to log out'));
    }
  };

  return createPortal(
    <div className={css.container} onClick={() => setOpen(false)}>
      <div className={css.content} onClick={e => e.stopPropagation()}>
        <nav className={css.navigation}>
          <IconButton onClick={() => setOpen(false)} path="M256-227.692 227.692-256l224-224-224-224L256-732.308l224 224 224-224L732.308-704l-224 224 224 224L704-227.692l-224-224-224 224Z" />
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
            <Button type="outlined">
              <img src={logo} alt="website" width={24} height={24} />
              <span>Website</span>
            </Button>
            <Button type="outlined">
              <img src={googlePlay} alt="google play" width={24} height={24} />
              <span>Google Play</span>
            </Button>
            <Button type="outlined">
              <img src={patreon} alt="patreon" width={24} height={24} />
              <span>Patreon</span>
            </Button>
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
            <Button onClick={handleLogOut} type="contained">Log out</Button>
          </section>
        </div>
      </div>
    </div>,
    document.body
  );
};
