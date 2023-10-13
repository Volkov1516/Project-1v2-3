import { useState } from 'react';

import css from './Home.module.css';

import { Header } from 'components/molecules/Header/Header';
import { ModalEditor } from 'components/molecules/ModalEditor/ModalEditor';

export const Home = ({ user, articles }) => {
  const [docState, setDocState] = useState([]);
  const [titleState, setTitleState] = useState('');
  const [modalEditorStatus, setModalEditorStatus] = useState(false);

  const openModalEditor = (id, doc, title) => {
    setDocState(doc);
    setTitleState(title);
    localStorage.setItem('currentDocId', id);
    setModalEditorStatus(true);
  };

  return (
    <div className={css.container}>
      <Header user={user} />
      <div className={css.main}>
        {articles?.map((i) => <article key={i?.id} onClick={() => openModalEditor(i?.id, i?.data()?.content, i?.data()?.title)}>
          {i?.data()?.title || 'Untitled'}
        </article>)}
      </div>
      <ModalEditor
        modalEditorStatus={modalEditorStatus}
        setModalEditorStatus={setModalEditorStatus}
        user={user}
        docState={docState}
        titleState={titleState}
        setTitleState={setTitleState}
      />
    </div>
  );
};
