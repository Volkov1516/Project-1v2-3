import { useRef, useState, useEffect, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPath } from 'redux/features/tree/treeSlice';

import { IconButton, Tooltip } from 'components';

import { Folders } from './Folders/Folders';
import { Notes } from './Notes/Notes';
import { Tasks } from './Tasks/Tasks';

import css from './Vault.module.css';

import { ARROW_BACK } from 'utils/variables';

import { findFolder } from 'utils/searchInManager';

export const Vault = memo(function MemoizedComponent() {
  const dispatch = useDispatch();

  const { windowWidth } = useSelector(state => state.app);
  const { documents } = useSelector(state => state.user);
  const { path } = useSelector(state => state.tree);

  const contentRef = useRef(null);

  const [folder, setFolder] = useState(null);

  useEffect(() => {
    contentRef.current && contentRef.current.scrollTo(0, 0);
  }, [path]);

  useEffect(() => {
    if (!documents) return;

    const definePath = targetFolder => setFolder(targetFolder);
    findFolder(documents, path[path.length - 1], definePath);
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
        <div data-type="navigation" className={css.navigation}>
          <Tooltip preferablePosition="bottom" content="Back">
            <IconButton dataType="navigation" variant="secondary" path={ARROW_BACK} onClick={handleBack} />
          </Tooltip>
          <span data-type="navigation" className={css.name}>{folder?.name}</span>
        </div>
      )}
      <div ref={contentRef} className={css.content}>
        {folder?.folders.length > 0 && <Folders folders={folder?.folders} />}
        {(folder?.folders.length > 0 && (folder?.notes.length > 0 || folder?.tasks.length > 0)) && <div className={css.divider} />}
        {folder?.notes.length > 0 && <Notes notes={folder?.notes} />}
        {(folder?.notes.length > 0 && folder?.tasks.length > 0) && <div className={css.divider} />}
        {folder?.tasks.length > 0 && <Tasks tasks={folder?.tasks} />}
      </div>
    </div>
  );
});
