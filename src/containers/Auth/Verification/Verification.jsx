import { useDispatch, useSelector } from 'react-redux';
import { setIsModalOpenVerificationEmail } from 'redux/features/app/appSlice';

import css from './Verification.module.css';

import { Modal, Button } from 'components';

export const Verification = () => {
  const dispatch = useDispatch();

  const { isModalOpenVerficationEmail } = useSelector(state => state.app);

  const handleClose = () => dispatch(setIsModalOpenVerificationEmail(false));

  const handleReloadPage = () => window.location.reload();

  return (
    <Modal open={isModalOpenVerficationEmail} close={handleClose}>
      <div className={css.container}>
        <p className={css.messageText}>Check your inbox for a confirmation email to activate your account.</p>
        <p className={css.afterText}>After confirmation, press:</p>
        <Button variant="outlined" onClick={handleReloadPage}>Reload Page</Button>
      </div>
    </Modal>
  );
};
