import { memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from 'redux/features/user/userSlice';
import {
  setDocuments,
  setFilteredDocumentsId,
  setCurrentDocument
} from 'redux/features/document/documentSlice';
import { setModalGlobalSettings } from 'redux/features/modal/modalSlice';
import { auth } from 'firebase.js';
import { signOut } from 'firebase/auth';

import css from './SettingsModal.module.css';

export const SettingsModal = memo(function SettingsComponent() {
  const dispatch = useDispatch();
  const { modalGlobalSettings } = useSelector(state => state.modal);
  const { email } = useSelector(state => state.user);

  const handleSignOut = async () => {
    await signOut(auth)
      .then(() => {
        dispatch(setUser({ id: null, email: null, categories: null }));
        dispatch(setDocuments(null));
        dispatch(setFilteredDocumentsId(null));
        dispatch(setCurrentDocument({
          isNew: null,
          index: null,
          id: null,
          title: null,
          content: null,
          color: null,
          categories: null,
          archive: null
        }));
        dispatch(setModalGlobalSettings(false));
      })
      .catch(error => console.log(error));
  };

  const handleOpen = () => {
    dispatch(setModalGlobalSettings(true));

    window.history.pushState({ modal: 'globalSettings' }, '', '#settings');
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
              <span className={css.email}>{email}</span>
            </div>
            <div className={css.signOutButton} onClick={handleSignOut}>sing out</div>
          </div>
        </div>
      )}
    </>
  );
});
