import { useState, useEffect } from 'react';
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
import { SET_MODAL_EDITOR_EMPTY, SET_MODAL_AUTOFOCUS } from 'redux/features/modal/modalSlice';
import { auth } from 'firebase.js';
import { signOut } from 'firebase/auth';
import { v4 as uuidv4 } from 'uuid';
import { EditTags } from './EditTags/EditTags';
import css from './Sidebar.module.css';

export const Sidebar = () => {
  const dispatch = useDispatch();
  const { tags, user } = useSelector(state => state.user);
  const { articles } = useSelector(state => state.article);

  const [tagsMenu, setTagsMenu] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [displayWidth, setDisplayWidth] = useState(null);

  useEffect(() => {
    setDisplayWidth(window.visualViewport.width);
  }, []);

  const openModalEditor = () => {
    const newId = uuidv4();
    const EMPTY_CONTENT = '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}';

    dispatch(setArticleId(newId));
    dispatch(setArticleTitle(''));
    dispatch(setArticleContent(EMPTY_CONTENT));
    dispatch(setArticleColor(null));
    dispatch(setArticleIndex(null));
    dispatch(setIsNewArticle(true));
    dispatch(SET_MODAL_AUTOFOCUS(true));
    dispatch(SET_MODAL_EDITOR_EMPTY(true));

    window.history.pushState({ modalEditorEmpty: 'opened' }, '', '#editor');
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
  };

  const handleArchive = () => {
    const filteredArticlesId = [];
    articles?.forEach(i => i?.archive && filteredArticlesId.push(i?.id));

    dispatch(setFilteredArticlesId(filteredArticlesId));
  };

  const setFilteredByCategory = (id) => {
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
  };

  const handleTagsDropdown = () => {
    setUserMenu(false);
    setTagsMenu(!tagsMenu)
  };

  const handleMenuDropdown = () => {
    setTagsMenu(false);
    setUserMenu(!userMenu);
  };

  return (
    <>
      {displayWidth > 639
        ? (
          <aside className={css.largeContainer}>
            <div className={css.start}>
              <button className={css.largeCreationButton} onClick={openModalEditor}>CREATE</button>
              <button onClick={handleAll}>articles</button>
              {tags?.map(i => <button className={css.tagButton} key={i?.id} onClick={() => setFilteredByCategory(i?.id)}>#{i?.name}</button>)}
              <EditTags />
              <button onClick={handleArchive}>archive</button>
            </div>
            <div className={css.end}>
              <button>settings</button>
              <button className={css.userButton} onClick={handleSignOut}>{user?.email}</button>
            </div>
          </aside>
        )
        : (
          <div className={css.smallContainer}>
            <div>
              <button onClick={handleMenuDropdown}>menu</button>
            </div>
            <div>
              <button className={css.smallActiveTagButton} onClick={handleTagsDropdown}>articles</button>
              <button className={css.smallCreationButton} onClick={openModalEditor}>CREATE</button>
            </div>
            {tagsMenu && (
              <div className={css.settings}>
                <button onClick={handleAll}>articles</button>
                {tags?.map(i => <button className={css.tagButton} key={i?.id} onClick={() => setFilteredByCategory(i?.id)}>#{i?.name}</button>)}
                <EditTags />
                <button onClick={handleArchive}>archive</button>
              </div>
            )}
            {userMenu && (
              <div className={css.settings}>
                <button>dark theme</button>
                <button>eye saver</button>
                <button>striped list</button>
                <button className={css.smallSignOutButton} onClick={handleSignOut}>sign out</button>
              </div>
            )}
          </div>
        )
      }
    </>
  );
};