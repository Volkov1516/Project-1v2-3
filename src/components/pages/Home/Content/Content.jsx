import { memo, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { FolderNavigation } from './FolderNavigation/FolderNavigation';
import { Folders } from './Folders/Folders';
import { Notes } from './Notes/Notes';
import { Tasks } from './Tasks/Tasks';

import css from './Content.module.css';

export const Content = memo(function MemoizedContent() {
  const { documents, path } = useSelector(state => state.user);

  const [folder, setFolder] = useState(null);

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

  return (
    <div className={css.container}>
      <FolderNavigation name={folder?.name} />
      <Folders folders={folder?.folders} />
      <Notes notes={folder?.notes} />
      <Tasks tasks={folder?.tasks} />
    </div>
  );
});
