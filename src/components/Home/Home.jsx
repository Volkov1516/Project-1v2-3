import { auth } from 'firebase.js';
import { signOut } from 'firebase/auth';

export const Home = () => {
  const handleSignOut = () => {
    signOut(auth).then(() => {
      console.log('Signed out successfully');
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });
  };

  return (
    <div>
      <button onClick={handleSignOut}>Sign out</button>
    </div>
  );
};
