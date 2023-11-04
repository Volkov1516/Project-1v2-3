import { useDispatch, useSelector } from 'react-redux';
import { SET_CURRENT_ID, SET_TITLE, SET_CONTENT } from 'redux/features/article/articleSlice';
import { SET_MODAL_EDITOR_EXISTING, SET_MODAL_AUTOFOCUS } from 'redux/features/modal/modalSlice';

import { Header } from 'components/organisms/Header/Header';
import { ModalEditor } from 'components/molecules/ModalEditor/ModalEditor';
import { ModalPreview } from 'components/molecules/ModalPreview/ModalPreview';
import { Content } from 'components/organisms/Content/Content';

export default function Home() {
  const dispatch = useDispatch();
  const { filteredArticles, articleIndex } = useSelector(state => state.article);

  let mouseTimer;

  const openModalEditorFromPreview = () => {
    window.history.pushState({modalEditor: 'opened'}, '', '#editor');

    dispatch(SET_TITLE(filteredArticles[articleIndex]?.title));
    dispatch(SET_CURRENT_ID(filteredArticles[articleIndex]?.id));
    dispatch(SET_CONTENT(filteredArticles[articleIndex]?.content));
    dispatch(SET_MODAL_AUTOFOCUS(false));
    dispatch(SET_MODAL_EDITOR_EXISTING(true));
  };

  const onMouseUp = () => mouseTimer && window.clearTimeout(mouseTimer);

  return (
    <div onScroll={onMouseUp}>
      <Header />
      <Content mouseTimer={mouseTimer} />
      <ModalEditor />
      <ModalPreview openModalEditorFromPreview={openModalEditorFromPreview} />
    </div>
  );
};
