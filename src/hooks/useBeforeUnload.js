import { useEffect } from 'react';
import { auth } from 'services/firebase';
import { signOut } from 'firebase/auth';

const useBeforeUnload = () => {
  useEffect(() => {
    const handleBeforeUnload = () => {
      // It run singOut even if email is approved. Because, onAuthStateChanged did not update verification status.
      if (!auth?.currentUser?.emailVerified) {
        signOut(auth);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);
};

export default useBeforeUnload;
