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
  const { settingsModal } = useSelector(state => state.modal);

  const [activeButtonId, setActiveButtonId] = useState('documents');
  const [activeCategoryText, setActiveCategoryText] = useState('documents');
  const [categoriesMenu, setCategoriesMenu] = useState(false);

  const categoriesWrapperRef = useRef(null);

  useEffect(() => {
    if (!categoriesMenu) return;

    categoriesWrapperRef.current.scrollTop = categoriesWrapperRef.current.scrollHeight;
  }, [categoriesMenu]);

  const handleCategoriesMenu = () => {
    if (settingsModal) window.history.back();

    setCategoriesMenu(!categoriesMenu);
  };

  const openEditorModal = () => {
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

    window.history.pushState({ modal: 'editorModalNew' }, '', '#editor');
  };

  const filterByAll = () => {
    const filteredDocumentsId = [];
    documents?.forEach(i => !i?.archive && filteredDocumentsId.push(i?.id));

    dispatch(setFilteredDocumentsId(filteredDocumentsId));
    setActiveButtonId('documents');
    setActiveCategoryText('documents');
    setCategoriesMenu(false);
  };

  const filterByArchive = () => {
    const filteredDocumentsId = [];
    documents?.forEach(i => i?.archive && filteredDocumentsId.push(i?.id));

    dispatch(setFilteredDocumentsId(filteredDocumentsId));
    setActiveButtonId('archive');
    setActiveCategoryText('archive');
    setCategoriesMenu(false);
  };

  const filterByCategory = (id, name) => {
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

  const categoriesComponent = () => {
    return (
      <div className={css.categoriesContainer}>
        <div id="documents" className={`${css.categoryButton} ${activeButtonId === "documents" && css.activeCategoryButton}`} onClick={filterByAll}>documents</div>
        {userCategories?.map(i => (
          <div id={i?.id} className={`${css.categoryButton} ${activeButtonId === i?.id && css.activeCategoryButton}`} key={i?.id} onClick={() => filterByCategory(i?.id, i?.name)}>
            {i?.name}
          </div>
        ))}
        <div id="archive" className={`${css.categoryButton} ${activeButtonId === "archive" && css.activeCategoryButton}`} onClick={filterByArchive}>archive</div>
        <CategoriesModal />
      </div>
    );
  };

  return (
    <div className={css.container}>
      <div className={css.start}>
        <div className={css.createButton} onClick={openEditorModal}>CREATE</div>
        <div className={css.largeDisplayCategoriesWrapper}>{categoriesComponent()}</div>
        <div className={`${css.smallDisplayCategoriesButton} ${categoriesMenu && css.activeCategoriesBtn}`} onClick={handleCategoriesMenu}>{activeCategoryText}</div>
      </div>
      <div className={css.end}><SettingsModal setCategoriesMenu={setCategoriesMenu} /></div>
      {categoriesMenu && <div ref={categoriesWrapperRef} className={css.smallDisplayCategoriesWrapper}>{categoriesComponent()}</div>}
    </div>
  );
};
