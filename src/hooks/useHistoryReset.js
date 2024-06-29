import { useEffect } from 'react';

const useHistoryReset = () => {
  useEffect(() => {
    window.history.replaceState(null, '', '/');
  }, []);
};

export default useHistoryReset;