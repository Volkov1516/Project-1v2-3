import { useEffect, useState, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPath } from 'redux/features/app/appSlice';

import { IconButton } from 'components/IconButton/IconButton';
import { Tooltip } from 'components/Tooltip/Tooltip';

import { Folders } from './Folders/Folders';
import { Notes } from './Notes/Notes';
import { Tasks } from './Tasks/Tasks';

import css from './Vault.module.css';

import { ARROW_BACK } from 'utils/variables';

export const Vault = memo(function MemoizedComponent() {
  const dispatch = useDispatch();
  const { windowWidth, path } = useSelector(state => state.app);
  const { documents } = useSelector(state => state.user);

  const [folder, setFolder] = useState(null);

  useEffect(() => {
    document.getElementById('managerContent').scrollTo(0, 0);
  }, [path]);

  useEffect(() => {
    function findFolder(object, id) {
      if (object?.id === id) {
        return object;
      } else if (object?.folders && object?.folders.length > 0) {
        for (let i = 0; i < object?.folders.length; i++) {
          const result = findFolder(object?.folders[i], id);

          if (result) {
            return result;
          }
        }
      }

      return null;
    }

    let res = findFolder(documents, path[path.length - 1]);
    setFolder(res);
  }, [documents, path]);

  const handleBack = () => {
    if (windowWidth <= 480) {
      window.history.back();
    }
    else {
      let newPath = JSON.parse(JSON.stringify(path));
      newPath.pop();
      dispatch(setPath([...newPath]));
    }
  };

  return (
    <div className={css.container}>
      {folder?.name && (
        <div data-id="folder-navigation" className={css.navigation}>
          <Tooltip preferablePosition="bottom" content="Back">
            <IconButton variant="secondary" path={ARROW_BACK} onClick={handleBack} />
          </Tooltip>
          <span data-id="folder-navigation" className={css.name}>{folder?.name}</span>
        </div>
      )}
      <div id="managerContent" className={css.content}>
        <Folders folders={folder?.folders} />

        {/* {(folder?.folders.length > 0 && (folder?.notes.length > 0 || folder?.tasks.length > 0)) && <div className={css.dividerFolders} />} */}
        <Notes notes={folder?.notes} />
        {/* {(folder?.notes.length > 0 && folder?.tasks.length > 0) && <div className={css.dividerNotes} />} */}
        <Tasks tasks={folder?.tasks} />
      </div>
    </div>
  );
});
