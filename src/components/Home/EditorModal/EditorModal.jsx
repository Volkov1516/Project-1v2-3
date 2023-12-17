import { useRef, useState, lazy, Suspense } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setEditorModalStatus } from 'redux/features/modal/modalSlice';
import { incrementIndex, decrementIndex } from 'redux/features/article/articleSlice';

import css from './EditorModal.module.css';

import { Title } from './Title/Title';
import { Editor } from './Editor/Editor';
const LazyArticleSettingsModal = lazy(() => import('./ArticleSettingsModal/ArticleSettingsModal'));

export default function EditorModal() {
  const dispatch = useDispatch();
  const { editorModalStatus } = useSelector(state => state.modal);
  const { filteredArticlesId, articleIndex, articleCategories, isNewArticle } = useSelector(state => state.article);

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
    if (articleIndex === 0) return;

    const modalPreviewElement = document.getElementById('editorModal');
    modalPreviewElement.scrollTo({ top: 0, behavior: 'instant' });
    dispatch(decrementIndex());
  };

  const next = () => {
    if (articleIndex === filteredArticlesId?.length - 1) return;

    const modalPreviewElement = document.getElementById('editorModal');
    modalPreviewElement.scrollTo({ top: 0, behavior: 'instant' });
    dispatch(incrementIndex());
  };

  const openEditorFromPreview = () => {
    dispatch(setEditorModalStatus('editFP'));

    window.history.pushState({modal: 'editFP'}, '', '#editor');
  }

  return editorModalStatus && (
    <div className={css.container} onClick={close} key={articleIndex}>
      <div className={css[editorModalStatus]} onClick={(e) => e.stopPropagation()}>
        <div className={css.navigation}>
          <div className={css.navigationStart}>
            <div className={css.navigationControlls}>
              <div className={css.arrowWrapper} onClick={prev}>
                <div className={css.arrowLeft} />
              </div>
              <div className={css.navigationCountBubble}>{`${articleIndex + 1}`}/{filteredArticlesId?.length}</div>
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
              {!isNewArticle && (
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
            {articleCategories?.map(i => (
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
