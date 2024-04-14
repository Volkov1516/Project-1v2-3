import { setNavigationPath } from 'redux/features/app/appSlice';

export const handleNavPath = (dispatch, path, type) => {
  const pathname = window.location.pathname;

  if (pathname.includes(path)) return;

  if (window.location.pathname === '/') {
    window.history.pushState({}, '', `${pathname}${path}`);
    dispatch(setNavigationPath(`${pathname}${path}`));
  }
  else {
    window.history.pushState({}, '', `${pathname}/${path}`);
    dispatch(setNavigationPath(`${pathname}/${path}`));
  }
};
