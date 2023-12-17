import { useSelector, useDispatch } from 'react-redux';
import { setModalGlobalSettings } from 'redux/features/modal/modalSlice';
import { auth } from 'firebase.js';
import { signOut } from 'firebase/auth';

import css from './UserSettingsModal.module.css';

export default function UserSettingsModal() {
  const dispatch = useDispatch();
  const { modalGlobalSettings } = useSelector(state => state.modal);
  const { user } = useSelector(state => state.user);

  const handleSignOut = () => signOut(auth);

  const handleOpen = () => {
    dispatch(setModalGlobalSettings(true));

    window.history.pushState({modal: 'globalSettings'}, '', '#settings');
  };

  const handleClose = () => {
    window.history.back();
  }

  return (
    <>
      <div className={css.openButton} onClick={handleOpen}>settings</div>
      {modalGlobalSettings && (
        <div className={css.container} onClick={handleClose}>
          <div className={css.content} onClick={(e) => e.stopPropagation()}>
            <div className={css.header}>
              <span className={css.title}>settings</span>
              <button className={css.closeButton} onClick={handleClose}>close</button>
            </div>
            <div className={css.group}>
              <span className={css.emailLabel}>email:</span>
              <span className={css.email}>{user?.email}</span>
            </div>
            <div className={css.signOutButton} onClick={handleSignOut}>sing out</div>
          </div>
        </div>
      )}
    </>
  );
};
