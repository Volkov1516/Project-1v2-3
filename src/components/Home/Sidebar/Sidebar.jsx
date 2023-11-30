import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setFilteredArticlesId,
  setArticleId,
  setArticleTitle,
  setArticleContent,
  setArticleColor,
  setArticleIndex,
  setIsNewArticle
} from 'redux/features/article/articleSlice';
import { setEditorModalStatus } from 'redux/features/modal/modalSlice';
import { auth } from 'firebase.js';
import { signOut } from 'firebase/auth';
import { v4 as uuidv4 } from 'uuid';
import { EditTags } from './EditTags/EditTags';
import css from './Sidebar.module.css';

export const Sidebar = () => {
  const dispatch = useDispatch();
  const { tags, user } = useSelector(state => state.user);
  const { articles } = useSelector(state => state.article);

  // const [tagsMenu, setTagsMenu] = useState(false);
  // const [userMenu, setUserMenu] = useState(false);
  const [activeButtonId, setActiveButtonId] = useState('articles');
  // const [activeButtonText, setActiveButtonText] = useState('articles');
  const [activeTagButton, setActiveTagButton] = useState(false);
  // const [activeMenu, setActiveMenu] = useState(false);

  const openModalEditor = () => {
    const newId = uuidv4();
    const EMPTY_CONTENT = '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}';

    dispatch(setArticleId(newId));
    dispatch(setArticleTitle(''));
    dispatch(setArticleContent(EMPTY_CONTENT));
    dispatch(setArticleColor(null));
    dispatch(setArticleIndex(null));
    dispatch(setIsNewArticle(true));
    dispatch(setEditorModalStatus('edit'));

    window.history.pushState({}, '', '#editor');
  };

  const handleSignOut = () => {
    signOut(auth).then(() => {
      console.log('Signed out successfully');
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });
  };

  const handleAll = () => {
    const filteredArticlesId = [];
    articles?.forEach(i => !i?.archive && filteredArticlesId.push(i?.id));

    dispatch(setFilteredArticlesId(filteredArticlesId));
    setActiveButtonId('articles');
    // setActiveButtonText('articles');
    // setTagsMenu(false);
    setActiveTagButton(!activeTagButton);
  };

  const handleArchive = () => {
    const filteredArticlesId = [];
    articles?.forEach(i => i?.archive && filteredArticlesId.push(i?.id));

    dispatch(setFilteredArticlesId(filteredArticlesId));
    setActiveButtonId('archive');
    // setActiveButtonText('archive');
    // setTagsMenu(false);
    setActiveTagButton(!activeTagButton);
  };

  const setFilteredByCategory = (id, name) => {
    const unarchived = articles?.filter(i => !i?.archive);
    let newArr = [];

    unarchived?.map(i => i?.tags?.map(j => {
      if (j.id === id) {
        return newArr.push(i?.id);
      }
      else {
        return i;
      }
    }));

    dispatch(setFilteredArticlesId(newArr));
    setActiveButtonId(id);
    // setActiveButtonText(`#${name}`);
    // setTagsMenu(false);
    setActiveTagButton(!activeTagButton);
  };

  // const handleTagsDropdown = () => {
  //   setUserMenu(false);
  //   setTagsMenu(!tagsMenu);
  //   setActiveTagButton(!activeTagButton);
  //   setActiveMenu(false);
  // };

  // const handleMenuDropdown = () => {
  //   setTagsMenu(false);
  //   setUserMenu(!userMenu);
  //   setActiveTagButton(false);
  //   setActiveMenu(!activeMenu);
  // };

  const tagsComponent = () => {
    return (
      <div className={css.tagsContainer}>
        <button id="articles" className={`${css.tagButton} ${activeButtonId === 'articles' && css.activeTagButton}`} onClick={handleAll}>articles</button>
        {tags?.map(i => (
          <button id={i?.id} className={`${css.tagButton} ${activeButtonId === i?.id && css.activeTagButton}`} key={i?.id} onClick={() => setFilteredByCategory(i?.id)}>
            #{i?.name}
          </button>
        ))}
        <button id="archive" className={`${css.archiveButton} ${activeButtonId === 'archive' && css.activeArchiveButton}`} onClick={handleArchive}>archive</button>
        <EditTags />
      </div>
    );
  };

  const settingsComponent = () => {
    return (
      <div>
        <div className={css.toggleGroup}>
          <span className={css.toggleGroupText}>dark theme</span>
          <label className={css.switch}>
            <input type="checkbox" />
            <span className={css.slider}></span>
          </label>
        </div>
        <div className={css.toggleGroup}>
          <span className={css.toggleGroupText}>eye saving</span>
          <label className={css.switch}>
            <input type="checkbox" />
            <span className={css.slider}></span>
          </label>
        </div>
        <div className={css.toggleGroup}>
          <span className={css.toggleGroupText}>column view</span>
          <label className={css.switch}>
            <input type="checkbox" />
            <span className={css.slider}></span>
          </label>
        </div>
        <div className={css.toggleGroup}>
          <span className={css.toggleGroupText}>striped list</span>
          <label className={css.switch}>
            <input type="checkbox" />
            <span className={css.slider}></span>
          </label>
        </div>
        <button className={css.userButton}>{user?.email}</button>
        <button className={css.smallSignOutButton} onClick={handleSignOut}>sign out</button>
      </div>
    );
  };

  return (
    <aside className={css.container}>
      <div className={css.start}>
        <button className={css.createButton} onClick={openModalEditor}>CREATE</button>
        <div className={css.categoriesWrapper}>{tagsComponent()}</div>
      </div>

      <div className={css.end}>
        <div className={css.settingsWrapper}>{settingsComponent()}</div>
        <div className={css.menuButtonSmall}>menu</div>
      </div>
    </aside>
  );
};
