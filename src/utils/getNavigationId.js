export const getNavigationPathId = (navigationPath, type) => {
  let navigationPathId;

  if (navigationPath) {
    if (navigationPath.includes(type)) {
      navigationPath?.split('/')?.forEach(i => {
        if (i.includes(type)) {
          navigationPathId = i.split('=')[1];
        }
      });
    }
    else {
      type === 'folder' ? navigationPathId = 'root' : navigationPathId = null;
    }
  }
  else {
    type === 'folder' ? navigationPathId = 'root' : navigationPathId = null;
  }

  return navigationPathId;
};
