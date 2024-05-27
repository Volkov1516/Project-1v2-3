import { memo, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { FolderNavigation } from './FolderNavigation/FolderNavigation';
import { DragAndDropProvider } from 'components/DragAndDrop/DragAndDropContext';
import { Folders } from './Folders/Folders';
import { Notes } from './Notes/Notes';
import { Tasks } from './Tasks/Tasks';

import css from './Manager.module.css';

export const Manager = memo(function MemoizedComponent() {
  const { windowWidth, path } = useSelector(state => state.app);
  const { documents } = useSelector(state => state.user);

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
    <DragAndDropProvider folder={folder} windowWidth={windowWidth}>
      <div className={css.container}>
        <div className={css.header}>
          <FolderNavigation name={folder?.name} />
        </div>
        <div id="managerContent" className={css.content}>
          <div className={css.wrapper}>
            <Folders folders={folder?.folders} />
            {(folder?.folders.length > 0 && (folder?.notes.length > 0 || folder?.tasks.length > 0)) && <div className={css.dividerFolders} />}
            <Notes notes={folder?.notes} />
            {(folder?.notes.length > 0 && folder?.tasks.length > 0) && <div className={css.dividerNotes} />}
            <Tasks tasks={folder?.tasks} />
          </div>
          {(documents.folders.length === 0 && documents.notes.length === 0 && documents.tasks.length === 0) && <div className={css.emptyAlert}>No Data</div>}
        </div>
      </div>
    </DragAndDropProvider>
  );
});
