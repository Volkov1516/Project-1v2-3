import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setWindowWidth } from 'redux/features/app/appSlice';

const useWindowResize = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleResize = () => dispatch(setWindowWidth(window.innerWidth));

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);
};

export default useWindowResize;