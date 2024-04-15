import { setAppPathname } from 'redux/features/app/appSlice';

export const addNavigationSegment = (dispatch, path) => {
  const URLPathname = window.location.pathname;

  if (URLPathname.includes(path)) return;

  let newPathname;
  URLPathname === '/' ? newPathname = `${URLPathname}${path}` : newPathname = `${URLPathname}/${path}`;

  window.history.pushState({}, '', newPathname);
  dispatch(setAppPathname(newPathname));
};

export const addNavigationSegmentFolder = (dispatch, folderId) => {
  const URLPathname = window.location.pathname;

  if (URLPathname.includes('folder')) {
    let newPathname = URLPathname.split('/');

    for (let i = 0; i < newPathname.length; i++) {
      if (newPathname[i].includes('folder')) {
        newPathname[i] = `folder=${folderId}`;
      }
    }

    window.history.pushState({}, '', newPathname.join('/'));
    dispatch(setAppPathname(newPathname.join('/')));
  }
  else {
    let newPathname;
    URLPathname === '/' ? newPathname = `folder=${folderId}` : newPathname = `folder=${folderId}/${URLPathname}`;

    window.history.pushState({}, '', newPathname);
    dispatch(setAppPathname(newPathname));
  }
};

export const addNavigationSegmentNote = (dispatch, noteId) => {
  const URLPathname = window.location.pathname;

  if (URLPathname.includes('note')) {
    let newPathname = URLPathname.split('/');

    for (let i = 0; i < newPathname.length; i++) {
      if (newPathname[i].includes('note')) {
        newPathname[i] = `note=${noteId}`;
      }
    }

    // replace - holds only one instance in state, push - holds as many as clicked
    window.history.replaceState({}, '', newPathname.join('/'));
    dispatch(setAppPathname(newPathname.join('/')));
  }
  else {
    let newPathname;
    URLPathname === '/' ? newPathname = `note=${noteId}` : newPathname = `${URLPathname}/note=${noteId}`;

    window.history.pushState({}, '', newPathname);
    dispatch(setAppPathname(newPathname));
  }
};
