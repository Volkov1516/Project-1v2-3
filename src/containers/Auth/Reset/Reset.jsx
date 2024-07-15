import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setIsModalOpenPasswordReset } from 'redux/features/app/appSlice';
import { setErrorAuthForm, sendPasswordResetEmailThunk } from 'redux/features/user/userSlice';

import css from './Reset.module.css';

import { Modal, Button, Input } from 'components';

export const Reset = () => {
  const dispatch = useDispatch();

  const { isModalOpenResetPassword } = useSelector(state => state.app);
  const { loadingAuthForm, errorAuthForm } = useSelector(state => state.user);

  const [emailInputValue, setEmailInputValue] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleResetPassword = () => {
    if (!emailInputValue) return;

    dispatch(sendPasswordResetEmailThunk({ email: emailInputValue }));

    setIsEmailSent(true);
  };

  const handleClose = () => {
    dispatch(setIsModalOpenPasswordReset(false));
    dispatch(setErrorAuthForm(''));
    setEmailInputValue('');
    setIsEmailSent(false);
  };

  return (
    <Modal open={isModalOpenResetPassword} close={handleClose}>
      <form className={css.container} onSubmit={handleResetPassword}>
        <Input label="Email to reset" id="resetInput" type="email" required placeholder="Enter email to reset" fullWidth value={emailInputValue} onChange={e => setEmailInputValue(e.target.value)} />
        <Button type="submit" variant="outlined" fullWidth loading={loadingAuthForm} disabled={!emailInputValue}>Send email</Button>
        {errorAuthForm && <p className={css.errorText}>{errorAuthForm}</p>}
        {isEmailSent && <p className={css.messageText}>Check your email to proceed password reset.</p>}
      </form>
    </Modal>
  );
};
