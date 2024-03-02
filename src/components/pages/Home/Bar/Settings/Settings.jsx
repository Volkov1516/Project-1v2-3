import { createPortal } from 'react-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setTheme, setSnackbar } from 'redux/features/app/appSlice';
import { updateUserName, updateUserPhoto } from 'redux/features/user/userSlice';
import { db } from 'firebase.js';
import { doc, setDoc } from 'firebase/firestore';

import { IconButton } from 'components/atoms/IconButton/IconButton';
import { Input } from 'components/atoms/Input/Input';
import { Switch } from 'components/atoms/Switch/Switch';
import { Button } from 'components/atoms/Button/Button';

import css from './Settings.module.css';

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

  return open && createPortal(
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
                <div className={css.accoutSettingsField}>Email <span className={css.emailText}>{userEmail}</span></div>
                <Input id="userNameInput" label="Name" value={userName} onChange={e => handleChangeUserName(e)} onBlur={handleBlurUserName} />
                <Input id="userPhotoInput" label="Photo URL" value={userPhoto} onChange={e => handleChangeUserPhoto(e)} onBlur={handleBlurUserPhoto} />
              </div>
            </div>
          </section>
          <section className={css.section}>
            <div className={css.sectionName}>Appearance</div>
            <div className={css.themeGroup}>
              <span>Dark theme</span>
              <Switch checked={theme === "dark" ? true : false} onChange={handleSwitchTheme} />
            </div>
          </section>
          <section className={css.section}>
            <div className={css.sectionName}>Links</div>
            <div>(icon) Website</div>
            <div>(icon) Play Market</div>
            <div>(icon) Patreon</div>
          </section>
          <section className={css.section}>
            <div className={css.sectionName}>Updates</div>
            <div>what's new</div>
            <div>future updates</div>
          </section>
          <section className={css.section}>
            <div className={css.sectionName}>Contacts</div>
            <div>email</div>
          </section>
          <Button text="Log out" />
        </div>
      </div>
    </div>,
    document.body
  );
};
