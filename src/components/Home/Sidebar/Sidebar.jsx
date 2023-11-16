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
          <aside className={css.container}>
            <div className={css.start}>
              <button className={css.desktopCreateBtn} onClick={openModalEditor}>CREATE</button>
              <button className={css.desktopArticlesBtn} onClick={handleAll}>articles</button>
              {tags?.map(i => (
                <button className={css.desktopCategoryBtn} key={i?.id} onClick={() => setFilteredByCategory(i?.id)}>#{i?.name}</button>
              ))}
              <EditTags />
              <button className={css.desktopArchiveBtn} onClick={handleArchive}>archive</button>
            </div>
            <div className={css.end}>
              <button className={css.desktopSettingsBtn}>settings</button>
              <button className={css.desktopUserBtn} onClick={handleSignOut}>{user?.email}</button>
            </div>
          </aside>
        )
        : (
          <div className={css.containerMobile}>
            <button className={css.mobileMobileBtn} onClick={handleMenuDropdown}>menu</button>
            <button className={css.mobileArticlesBtn} onClick={handleTagsDropdown}>articles</button>
            <button className={css.mobileCreateBtn} onClick={openModalEditor}>CREATE</button>
            {tagsMenu && (
              <div className={css.tagsDropdown}>
                <button className={css.mobileAllArticlesBtn} onClick={handleAll}>articles</button>
                {tags?.map(i => (
                  <button className={css.mobileCategoryBtn} key={i?.id} onClick={() => setFilteredByCategory(i?.id)}>#{i?.name}</button>
                ))}
                <EditTags />
                <button className={css.mobileArchiveBtn} onClick={handleArchive}>archive</button>
              </div>
            )}
            {userMenu && (
              <div className={css.menuDropdown}>
                <button className={css.mobileUserItemBtn}>dark theme</button>
                <button className={css.mobileUserItemBtn}>eye saver</button>
                <button className={css.mobileUserItemBtn}>striped list</button>
                <button className={`${css.mobileUserItemBtn} ${css.mobileSignOutBtn}`} onClick={handleSignOut}>sign out</button>
              </div>
            )}
          </div>
        )
      }
    </>
  );
};
