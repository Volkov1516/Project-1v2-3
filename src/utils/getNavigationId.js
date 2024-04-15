export const getNavigationPathId = (appPathname, type) => {
  let appPathnameId;

  if (appPathname) {
    if (appPathname.includes(type)) {
      appPathname?.split('/')?.forEach(i => {
        if (i.includes(type)) {
          appPathnameId = i.split('=')[1];
        }
      });
    }
    else {
      type === 'folder' ? appPathnameId = 'root' : appPathnameId = null;
    }
  }
  else {
    type === 'folder' ? appPathnameId = 'root' : appPathnameId = null;
  }

  return appPathnameId;
};
