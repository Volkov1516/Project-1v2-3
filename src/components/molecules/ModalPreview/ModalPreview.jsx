import React from 'react';

import Button from 'components/atoms/Button/Button';
import { Editor } from 'components/organisms/Editor/Editor';

import css from './ModalPreview.module.css';

export const ModalPreview = ({
  openElement,
  modalPreviewStatus,
  setModalPreviewStatus,
  docState
}) => {
  return (
    <>
      {openElement}
      {modalPreviewStatus && (
        <div className={css.container} onClick={() => setModalPreviewStatus(false)}>
          <div className={css.content} onClick={(e) => e.stopPropagation()}>
            <div className={css.header}>
              <div className={css.left}>
                <Button variant="contained">prev</Button>
                <Button variant="contained">next</Button>
                <Button variant="text">edit</Button>
                <Button variant="text">delete</Button>
              </div>
              <div className={css.right}>
                <Button variant="text" onClick={() => setModalPreviewStatus(false)}>close</Button>
              </div>
            </div>
            <div className={css.editor}>
              <Editor preview={true} docState={docState} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
