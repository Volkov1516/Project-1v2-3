import { useState } from 'react';
import { useSelector } from 'react-redux';
import { auth } from 'firebase.js';
import { signOut } from 'firebase/auth';

import css from './UserSettingsModal.module.css';

export const UserSettingsModal = () => {
  const { user } = useSelector(state => state.user);

  const [open, setOpen] = useState(false);

  const handleSignOut = () => signOut(auth);

  return (
    <>
      <div className={css.openButton} onClick={() => setOpen(true)}>settings</div>
      {open && (
        <div className={css.container} onClick={() => setOpen(false)}>
          <div className={css.content} onClick={(e) => e.stopPropagation()}>
            <div className={css.header}>
              <span className={css.title}>settings</span>
              <button className={css.closeButton} onClick={() => setOpen(false)}>close</button>
            </div>
            <div className={css.group}>
              <span className={css.emailLabel}>Email:</span>
              <span className={css.email}>{user?.email}</span>
            </div>
            <div className={css.signOutButton} onClick={handleSignOut}>Sing Out</div>
          </div>
        </div>
      )}
    </>
  );
};
