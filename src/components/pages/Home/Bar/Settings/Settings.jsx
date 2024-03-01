import { createPortal } from 'react-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserName, updateUserPhoto } from 'redux/features/user/userSlice';
import { db } from 'firebase.js';
import { doc, setDoc } from 'firebase/firestore';

import { IconButton } from 'components/atoms/IconButton/IconButton';
import { Input } from 'components/atoms/Input/Input';

import css from './Settings.module.css';

export const Settings = ({ open, setOpen }) => {
  const dispatch = useDispatch();

  const { userId, userEmail, userName, userPhoto } = useSelector(state => state.user);

  const handleUserName = (e) => {
    dispatch(updateUserName(e.target.value));
  };

  const handleBlurUserName = async () => {
    await setDoc(doc(db, 'users', userId), { name: userName }, { merge: true });
  };

  const handleUserPhoto = (e) => {
    dispatch(updateUserPhoto(e.target.value));
  };

  const handleBlurUserPhoto = async () => {
    await setDoc(doc(db, 'users', userId), { photo: userPhoto }, { merge: true });
  };

  return open && createPortal(
    <div className={css.container} onClick={() => setOpen(false)}>
      <div className={css.content} onClick={e => e.stopPropagation()}>
        <nav className={css.navigation}>
          <IconButton onClick={() => setOpen(false)} path="M256-227.692 227.692-256l224-224-224-224L256-732.308l224 224 224-224L732.308-704l-224 224 224 224L704-227.692l-224-224-224 224Z" />
        </nav>
        <section className={css.section}>
          <div className={css.sectionName}>Account</div>
          <div className={css.accountGroup}>
            <img src={userPhoto} alt="avatar" className={css.photo} />
            <div className={css.accoutSettings}>
              <div className={css.accoutSettingsField}>Email <span className={css.emailText}>{userEmail}</span></div>
              <Input label="Name" value={userName} onChange={e => handleUserName(e)} onBlur={handleBlurUserName}/>
              <Input label="Photo URL" value={userPhoto} onChange={e => handleUserPhoto(e)} onBlur={handleBlurUserPhoto}/>
            </div>
          </div>
        </section>
      </div>
    </div>,
    document.body
  );
};
