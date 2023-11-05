import { Header } from 'components/organisms/Header/Header';
import { Content } from 'components/organisms/Content/Content';
import { ModalEditor } from 'components/molecules/ModalEditor/ModalEditor';
import { ModalPreview } from 'components/molecules/ModalPreview/ModalPreview';

export default function Home() {
  let mouseTimer;

  const onMouseUp = () => mouseTimer && window.clearTimeout(mouseTimer);

  return (
    <div onScroll={onMouseUp}>
      <Header />
      <Content mouseTimer={mouseTimer} />
      <ModalEditor />
      <ModalPreview />
    </div>
  );
};
