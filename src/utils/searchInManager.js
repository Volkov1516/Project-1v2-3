export const findFolder = (object, id, callback) => {
  if (object.id === id) {
    callback(object);
  }
  else {
    if (object.folders && object.folders.length > 0) {
      for (let i = 0; i < object.folders.length; i++) {
        findFolder(object.folders[i], id, callback);
      }
    }
  }
};

export const getParentFolder = (object, id) => {
  if (object.folders && object.folders.length > 0) {
    for (let i = 0; i < object.folders.length; i++) {
      if (object.folders[i].id === id) {
        return object.id;
      }
      else {
        return getParentFolder(object.folders[i], id);
      }
    }
  }
};
