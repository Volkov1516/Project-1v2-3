import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setModalGlobalSettings, setAddFolderModal, setModalFolderSettings, setEditNoteModal, setNoteModal, setPath } from 'redux/features/app/appSlice';

const useNavigation = (auth) => {
  const dispatch = useDispatch();

  const { path } = useSelector(state => state.app);

  useEffect(() => {
    const handleHashchange = (e) => {
      if (e.oldURL.includes('#settings')) {
        dispatch(setModalGlobalSettings(false));
      }
      else if (e.oldURL.includes('#addFolder')) {
        dispatch(setAddFolderModal(false));
      }
      else if (e.oldURL.includes('#editFolder')) {
        dispatch(setModalFolderSettings(false));
      }
      else if (e.oldURL.includes('#editNote')) {
        dispatch(setEditNoteModal(false));
      }
      else if (e.oldURL.includes('#editor')) {
        dispatch(setNoteModal(false));
      }
      else if (e.newURL.includes('#folder')) {
        let currentHash = window.location.hash.split('/')[1];

        if (!currentHash) {
          dispatch(setPath(['root']));
        }
        else if (path.includes(currentHash)) {
          let newPath = JSON.parse(JSON.stringify(path));
          newPath.pop();

          dispatch(setPath([...newPath]));
        }
        else {
          dispatch(setPath([...path, currentHash]));
        }
      }
      else if (e.oldURL.includes('#folder') && !window.location.hash) {
        dispatch(setPath(['root']));
      }
    };

    window.addEventListener('hashchange', handleHashchange);

    return () => window.removeEventListener('hashchange', handleHashchange);
  }, [dispatch, path]);
};

export default useNavigation;