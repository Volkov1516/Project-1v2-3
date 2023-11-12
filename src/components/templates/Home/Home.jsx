import { useSelector } from 'react-redux';
import { Sidebar } from 'components/organisms/Sidebar/Sidebar';
import { Content } from 'components/organisms/Content/Content';
import { ModalEditor } from 'components/molecules/ModalEditor/ModalEditor';
import { ModalPreview } from 'components/molecules/ModalPreview/ModalPreview';

export default function Home() {
  const { modalEditorEmpty, modalEditorExisting, modalPreview } = useSelector(state => state.modal);

  let mouseTimer;

  const onMouseUp = () => mouseTimer && window.clearTimeout(mouseTimer);

  return (
    <div onScroll={onMouseUp}>
      <Sidebar />
      <Content mouseTimer={mouseTimer} />
      {(modalEditorEmpty || modalEditorExisting) && <ModalEditor />}
      {modalPreview && <ModalPreview />}
    </div>
  );
};
