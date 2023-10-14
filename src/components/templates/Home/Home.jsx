import { useState } from 'react';

import css from './Home.module.css';

import { Header } from 'components/molecules/Header/Header';
import { ModalEditor } from 'components/molecules/ModalEditor/ModalEditor';
import { ModalPreview } from 'components/molecules/ModalPreview/ModalPreview';

export const Home = ({ user, articles }) => {
  let mouseTimer;

  const [docState, setDocState] = useState([]);
  const [titleState, setTitleState] = useState('');
  const [modalEditorStatus, setModalEditorStatus] = useState(false);
  const [modalPreviewStatus, setModalPreviewStatus] = useState(false);
  const [currentDocIndex, setCurrentDocIndex] = useState(null);

  const openModalEditor = (id, doc, title) => {
    setDocState(doc);
    setTitleState(title);
    localStorage.setItem('currentDocId', id);
    setModalEditorStatus(true);
  };

  const onMouseDown = (id, doc, title, index) => {
    onMouseUp();

    mouseTimer = window.setTimeout(() => {
      setCurrentDocIndex(index);
      setDocState(doc);
      setTitleState(title);
      localStorage.setItem('currentDocId', id);
      setModalPreviewStatus(true);
    }, 500);
  };

  const onMouseUp = () => mouseTimer && window.clearTimeout(mouseTimer);

  return (
    <div className={css.container} onScroll={onMouseUp}>
      <Header user={user} />
      <div className={css.main} onScroll={onMouseUp}>
        {articles?.map((i, index) => (
          <article
            key={i?.id}
            onClick={() => openModalEditor(i?.id, i?.data()?.content, i?.data()?.title)}
            onMouseDown={() => onMouseDown(i?.id, i?.data()?.content, i?.data()?.title, index)}
            onMouseUp={onMouseUp}
            onTouchStart={() => onMouseDown(i?.id, i?.data()?.content, i?.data()?.title, index)}
            onTouchEnd={onMouseUp}
          >
            {i?.data()?.title || 'Untitled'}
          </article>
        ))}
      </div>
      <ModalEditor
        modalEditorStatus={modalEditorStatus}
        setModalEditorStatus={setModalEditorStatus}
        user={user}
        docState={docState}
        titleState={titleState}
        setTitleState={setTitleState}
      />
      <ModalPreview
        modalPreviewStatus={modalPreviewStatus}
        setModalPreviewStatus={setModalPreviewStatus}
        docState={docState}
        titleState={titleState}
        setTitleState={setTitleState}
        currentDocIndex={currentDocIndex}
        setCurrentDocIndex={setCurrentDocIndex}
        articles={articles}
      />
    </div>
  );
};
