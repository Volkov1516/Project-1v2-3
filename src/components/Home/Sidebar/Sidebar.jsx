import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilteredDocumentsId, setCurrentDocument } from 'redux/features/document/documentSlice';
import { setEditorModalStatus } from 'redux/features/modal/modalSlice';
import { v4 as uuidv4 } from 'uuid';

import { CategoriesModal } from './CategoriesModal/CategoriesModal';
import { SettingsModal } from './SettingsModal/SettingsModal';

import css from './Sidebar.module.css';

export const Sidebar = () => {
  const dispatch = useDispatch();
  const { userCategories } = useSelector(state => state.user);
  const { documents } = useSelector(state => state.document);
  const { modalGlobalSettings } = useSelector(state => state.modal);

  const [activeButtonId, setActiveButtonId] = useState('documents');
  const [activeCategoryText, setActiveCategoryText] = useState('documents');
  const [categoriesMenu, setCategoriesMenu] = useState(false);

  const scrollRef = useRef(null);

  useEffect(() => {
    if (!categoriesMenu) return;

    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [categoriesMenu]);

  const openModalEditor = () => {
    dispatch(setCurrentDocument({
      isNew: true,
      index: null,
      id: uuidv4(),
      title: '',
      content: '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
      color: null,
      categories: [],
      archive: false
    }));
    dispatch(setEditorModalStatus('edit'));

    window.history.pushState({ modal: 'new' }, '', '#editor');
  };

  const handleAll = () => {
    const filteredDocumentsId = [];
    documents?.forEach(i => !i?.archive && filteredDocumentsId.push(i?.id));

    dispatch(setFilteredDocumentsId(filteredDocumentsId));
    setActiveButtonId('documents');
    setActiveCategoryText('documents');
    setCategoriesMenu(false);
  };

  const handleArchive = () => {
    const filteredDocumentsId = [];
    documents?.forEach(i => i?.archive && filteredDocumentsId.push(i?.id));

    dispatch(setFilteredDocumentsId(filteredDocumentsId));
    setActiveButtonId('archive');
    setActiveCategoryText('archive');
    setCategoriesMenu(false);
  };

  const setFilteredByCategory = (id, name) => {
    const unarchived = documents?.filter(i => !i?.archive);
    let newArr = [];

    unarchived?.map(i => i?.categories?.map(j => {
      if (j.id === id) {
        return newArr.push(i?.id);
      }
      else {
        return i;
      }
    }));

    dispatch(setFilteredDocumentsId(newArr));
    setActiveButtonId(id);
    setActiveCategoryText(name);
    setCategoriesMenu(false);
  };

  const handleCategoriesMenu = () => {
    if (modalGlobalSettings) {
      window.history.back();
    }
    setCategoriesMenu(!categoriesMenu);
  };

  const categoriesComponent = () => {
    return (
      <div className={css.categoriesContainer}>
        <div id="documents" className={`${css.categoryButton} ${activeButtonId === "documents" && css.activeCategoryButton}`} onClick={handleAll}>documents</div>
        {userCategories?.map(i => (
          <div id={i?.id} className={`${css.categoryButton} ${activeButtonId === i?.id && css.activeCategoryButton}`} key={i?.id} onClick={() => setFilteredByCategory(i?.id, i?.name)}>
            {i?.name}
          </div>
        ))}
        <div id="archive" className={`${css.categoryButton} ${activeButtonId === "archive" && css.activeCategoryButton}`} onClick={handleArchive}>archive</div>
        <CategoriesModal />
      </div>
    );
  };

  return (
    <div className={css.container}>
      <div className={css.start}>
        <div className={css.createButton} onClick={openModalEditor}>CREATE</div>
        <div className={css.largeDisplayCategoriesWrapper}>{categoriesComponent()}</div>
        <div className={`${css.smallDisplayCategoriesButton} ${categoriesMenu && css.activeCategoriesBtn}`} onClick={handleCategoriesMenu}>{activeCategoryText}</div>
      </div>
      <div className={css.end}><SettingsModal setCategoriesMenu={setCategoriesMenu} /></div>
      {categoriesMenu && <div ref={scrollRef} className={css.smallDisplayCategoriesWrapper}>{categoriesComponent()}</div>}
    </div>
  );
};
