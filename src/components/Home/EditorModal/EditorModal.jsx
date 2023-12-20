import { useRef, useState, lazy, Suspense } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setEditorModalStatus } from 'redux/features/modal/modalSlice';
import { updateDocumentIndex } from 'redux/features/article/articleSlice';

import css from './EditorModal.module.css';

import { Title } from './Title/Title';
import { Editor } from './Editor/Editor';
const LazyArticleSettingsModal = lazy(() => import('./ArticleSettingsModal/ArticleSettingsModal'));

export default function EditorModal() {
  const dispatch = useDispatch();
  const { editorModalStatus } = useSelector(state => state.modal);
  const { filteredDocumentsId, isNewDocument, documentIndex, documentCategories } = useSelector(state => state.article);

  const editorRef = useRef(null);
  const titleRef = useRef(null);

  const [saving, setSaving] = useState(false);

  const close = () => {

    window.history.back();


    // switch (editorModalStatus) {
    //   case 'edit':
    //     // dispatch(setEditorModalStatus(false));
    //     // window.history.pushState({}, '', '/');
    //     window.history.back();
    //     break;
    //   // case 'editFC':
    //   //   dispatch(setEditorModalStatus(false));
    //   //   window.history.pushState({}, '', '/');
    //   //   break;
    //   // case 'editFP':
    //   //   dispatch(setEditorModalStatus('preview'));
    //   //   window.history.pushState({}, '', '#preview');
    //   //   break;
    //   // case 'preview':
    //   //   dispatch(setEditorModalStatus(false));
    //   //   window.history.pushState({}, '', '/');
    //   //   break;
    //   default:
    //     return;
    // }
  };

  const prev = () => {
    if (documentIndex === 0) return;

    const modalPreviewElement = document.getElementById('editorModal');
    modalPreviewElement.scrollTo({ top: 0, behavior: 'instant' });
    dispatch(updateDocumentIndex(documentIndex - 1));
  };

  const next = () => {
    if (documentIndex === filteredDocumentsId?.length - 1) return;

    const modalPreviewElement = document.getElementById('editorModal');
    modalPreviewElement.scrollTo({ top: 0, behavior: 'instant' });
    dispatch(updateDocumentIndex(documentIndex + 1));
  };

  const openEditorFromPreview = () => {
    dispatch(setEditorModalStatus('editFP'));

    window.history.pushState({modal: 'editFP'}, '', '#editor');
  }

  return editorModalStatus && (
    <div className={css.container} onClick={close} key={documentIndex}>
      <div className={css[editorModalStatus]} onClick={(e) => e.stopPropagation()}>
        <div className={css.navigation}>
          <div className={css.navigationStart}>
            <div className={css.navigationControlls}>
              <div className={css.arrowWrapper} onClick={prev}>
                <div className={css.arrowLeft} />
              </div>
              <div className={css.navigationCountBubble}>{`${documentIndex + 1}`}/{filteredDocumentsId?.length}</div>
              <div className={css.arrowWrapper} onClick={next}>
                <div className={css.arrowRight} />
              </div>
            </div>
            <button className={css.navigationEditButton} onClick={openEditorFromPreview}>edit</button>
            <div className={css.navigationSettingsWrapper}>
              <Suspense>
                <LazyArticleSettingsModal />
              </Suspense>
            </div>
          </div>
          <div className={css.navigationEnd}>
            <div className={css.navigationCloseButton} onClick={close}>close</div>
          </div>
        </div>
        <div id="editorModal" ref={editorRef} className={css.editor}>
          <div className={css.header}>
            <div className={css.headerStart}>
              <div className={css.headerCloseButton} onClick={close}>close</div>
            </div>
            <div className={css.headerEnd}>
              {!isNewDocument && (
                <Suspense>
                  <LazyArticleSettingsModal />
                </Suspense>
              )}
            </div>
          </div>
          <div className={css.titleWrapper}>
            <Title ref={titleRef} saving={saving} setSaving={setSaving}/>
          </div>
          <Editor editorRef={editorRef} titleRef={titleRef} saving={saving} setSaving={setSaving} />
          <div className={css.categoriesContainer}>
            {documentCategories?.map(i => (
              <div key={i?.id} className={css.category}>
                {i?.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
