import React from 'react';

import Button from 'components/atoms/Button/Button';
import { Editor } from 'components/organisms/Editor/Editor';
import { ModalDelete } from '../ModalDelete/ModalDelete';

import css from './ModalPreview.module.css';

export const ModalPreview = ({
  openElement,
  modalPreviewStatus,
  setModalPreviewStatus,
  docState,
  titleState,
  setTitleState,
  currentDocIndex,
  setCurrentDocIndex,
  articles,
  openModalEditorFromPreview,
  currentDocId
}) => {
  const prev = () => {
    if (currentDocIndex === 0) return;

    setCurrentDocIndex(currentDocIndex - 1);
  };

  const next = () => {
    if (currentDocIndex === articles?.length - 1) return;

    setCurrentDocIndex(currentDocIndex + 1);
  };

  return (
    <>
      {openElement}
      {modalPreviewStatus && (
        <div className={css.container} onClick={() => setModalPreviewStatus(false)}>
          <div className={css.content} onClick={(e) => e.stopPropagation()}>
            <div className={css.header}>
              <div className={css.left}>
                <div className={css.navigation}>
                  <Button variant="contained" onClick={prev}>prev</Button>
                  <Button variant="contained" onClick={next}>next</Button>
                </div>
                <Button variant="text" onClick={openModalEditorFromPreview}>edit</Button>
                <Button variant="text">archive</Button>
                <ModalDelete title={titleState || "Untitled"} id={currentDocId} />
              </div>
              <div className={css.right}>
                <Button variant="text" onClick={() => setModalPreviewStatus(false)}>close</Button>
              </div>
            </div>
            <div className={css.editor}>
              <div className={css.title}>{titleState || "Untitled"}</div>
              <Editor preview={true} docState={docState} articles={articles} currentDocIndex={currentDocIndex} setTitleState={setTitleState} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
