import { useState, useRef, useEffect } from 'react';

import css from './ModalEditror.module.css';

import Button from 'components/atoms/Button/Button';
import { Title } from './Title/Title';
import { Editor } from 'components/organisms/Editor/Editor';

export const ModalEditor = () => {
  const modalEditorContentRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [top, setTop] = useState(0);

  useEffect(() => {
    const viewportHeight = window.visualViewport.height;
    setTop(viewportHeight);
  }, []);

  const handleScroll = (e) => {
    const viewportHeight = window.visualViewport.height - 100;

    setTop(viewportHeight + e.target.scrollTop)
  }

  return (
    <>
      <Button variant="contained" size="large" onClick={() => setOpen(true)}>CREATE</Button>
      {open && (
        <div className={css.container}>
          <div className={css.header}>
            <div className={css.left}>
              <Button variant="text" onClick={() => setOpen(false)}>close</Button>
            </div>
            <div className={css.right}>
              <Button variant="text">collection</Button>
              <Button variant="text">settings</Button>
            </div>
          </div>
          <div ref={modalEditorContentRef} className={css.content} onScroll={handleScroll}>
            <Title />
            <Editor modalEditorContentRef={modalEditorContentRef} />
            <div style={{width: "200px", height: "40px", position: "absolute", backgroundColor: "red", top: top}}></div>
          </div>
        </div>
      )}
    </>
  );
};
