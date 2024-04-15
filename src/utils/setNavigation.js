import { setAppPathname } from 'redux/features/app/appSlice';

export const addNavigationSegment = (dispatch, path) => {
  const URLPathname = window.location.pathname;

  if (URLPathname.includes(path)) return;

  let newPathname;
  window.location.pathname === '/' ? newPathname = `${URLPathname}${path}` : newPathname = `${URLPathname}/${path}`;

  window.history.pushState({}, '', newPathname);
  dispatch(setAppPathname(newPathname));
};
