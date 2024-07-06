import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setIsModalOpenPasswordReset } from 'redux/features/app/appSlice';
import { sendPasswordResetEmailThunk } from 'redux/features/user/userSlice';

import css from './Reset.module.css';

import { Modal, Button, Input } from 'components';

export const Reset = () => {
  const dispatch = useDispatch();

  const { isModalOpenResetPassword } = useSelector(state => state.app);
  const { authFormLoading, authFormError } = useSelector(state => state.user);

  const [emailInputValue, setEmailInputValue] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleResetPassword = () => {
    if (!emailInputValue) return;

    dispatch(sendPasswordResetEmailThunk({ email: emailInputValue }));

    setIsEmailSent(true);
  };

  const handleClose = () => {
    dispatch(setIsModalOpenPasswordReset(false));
    setEmailInputValue('');
    setIsEmailSent(false);
  };

  return (
    <Modal open={isModalOpenResetPassword} close={handleClose}>
      <div className={css.container}>
        <Input label="Email to reset" id="resetInput" type="email" placeholder="Enter email to reset" fullWidth value={emailInputValue} onChange={e => setEmailInputValue(e.target.value)} />
        <Button variant="outlined" fullWidth loading={authFormLoading} disabled={!emailInputValue} onClick={handleResetPassword}>Send email</Button>
        {authFormError && <p className={css.errorText}>{authFormError}</p>}
        {isEmailSent && <p className={css.messageText}>Check your email to proceed password reset.</p>}
      </div>
    </Modal>
  );
};
