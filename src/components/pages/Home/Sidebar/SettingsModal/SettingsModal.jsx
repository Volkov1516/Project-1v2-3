import { memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from 'redux/features/user/userSlice';
import {
  setDocuments,
  setFilteredDocumentsId,
  setCurrentDocument
} from 'redux/features/document/documentSlice';
import { setSettingsModal } from 'redux/features/modal/modalSlice';
import { auth } from 'firebase.js';
import { signOut } from 'firebase/auth';

import css from './SettingsModal.module.css';

export const SettingsModal = memo(function SettingsComponent({ setCategoriesMenu }) {
  const dispatch = useDispatch();
  const { settingsModal } = useSelector(state => state.modal);
  const { email } = useSelector(state => state.user);

  const open = () => {
    setCategoriesMenu(false);

    if (settingsModal) {
    }
    else {
      dispatch(setSettingsModal(true));

    }
  };


  const logOut = async () => {
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
        dispatch(setSettingsModal(false));
      })
      .catch(error => console.log(error));
  };

  return (
    <>
      <div className={`${css.openButton} ${settingsModal && css.openButtonActive}`} onClick={open}>settings</div>
      {settingsModal && (
        <div className={css.container} onClick={close}>
          <div className={css.content} onClick={(e) => e.stopPropagation()}>
            <div className={css.header}>
              <span className={css.title}>settings</span>
              <button className={css.closeButton} onClick={close}>close</button>
            </div>
            <div className={css.group}>
              <span className={css.email}>{email}</span>
            </div>
            <div className={css.group}>
              <span className={css.email}>info</span>
            </div>
            <div className={css.group}>
              <span className={css.email}>contacts</span>
            </div>
            <div className={css.group}>
              <span className={css.email}>support the project</span>
            </div>
            <div className={css.signOutButton} onClick={logOut}>sing out</div>
          </div>
        </div>
      )}
    </>
  );
});
