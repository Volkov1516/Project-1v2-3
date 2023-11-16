import { useSelector } from 'react-redux';
import { Sidebar } from './Sidebar/Sidebar';
import { Content } from './Content/Content';
import { ModalEditor } from 'components/Home/ModalEditor/ModalEditor';
import { ModalPreview } from 'components/Home/ModalPreview/ModalPreview';

import css from './Home.module.css';

export default function Home() {
  const { modalEditorEmpty, modalEditorExisting, modalPreview } = useSelector(state => state.modal);

  let mouseTimer;

  const onMouseUp = () => mouseTimer && window.clearTimeout(mouseTimer);

  return (
    <div className={css.container} onScroll={onMouseUp}>
      <Sidebar />
      <Content mouseTimer={mouseTimer} />
      {(modalEditorEmpty || modalEditorExisting) && <ModalEditor />}
      {modalPreview && <ModalPreview />}
    </div>
  );
};
