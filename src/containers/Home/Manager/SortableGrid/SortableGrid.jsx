// disabled - запрещает перетаскивание, позволяет скролить на моб
// delay - задержка перед перетаскиванием в ms, delayOnTouchOnly - только для сенсора
// sort - запрещает или разрешает смену позиций
// onChoose - срабатывает сразу после delay, здесь можно запускать таймер для модалки
// onStart - срабатывает сразу после перемещенияб здесь надо сбивать таймер модалки

// Перемещение в/из Folder.

import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setEditNoteModal } from 'redux/features/app/appSlice';
import Sortable from 'sortablejs';

import { Modal } from 'components/Modal/Modal';

import css from './SortableGrid.module.css';

const SortableComponent = () => {
  const dispatch = useDispatch();

  const { editNoteModal } = useSelector(state => state.app);

  const containerRef = useRef(null);
  const holdTimeout = useRef(null);
  const swapTimeout = useRef(null);

  const [items, setItems] = useState([
    { id: 1, name: "fiona1" },
    { id: 2, name: "fiona1fiona1fiona1fiona1fiona1fiona1fiona1fiona1fiona1fiona1fiona1fiona1fiona1fiona1fiona1fiona1fiona1fiona1fiona1fiona1" },
    { id: 3, name: "fiona3" },
    { id: 4, name: "fiona4" },
    { id: 5, name: "fiona5" },
    { id: 6, name: "fiona6" },
    { id: 7, name: "fiona6" },
    { id: 8, name: "fiona6" },
    { id: 9, name: "fiona6" },
    { id: 10, name: "fiona6" },
    { id: 11, name: "fiona6" },
    { id: 12, name: "fiona6" },
    { id: 13, name: "fiona6" },
  ]);

  const handleSortEnd = (oldIndex, newIndex) => {
    const updatedItems = [...items];
    const [movedItem] = updatedItems.splice(oldIndex, 1);
    updatedItems.splice(newIndex, 0, movedItem);
    setItems(updatedItems);
  };

  useEffect(() => {
    let overFolder;
    let canSwapWithFolder = false;
    const FOLDER_SWAP_TIMEOUT = 1000;

    if (containerRef.current) {
      const sortable = new Sortable(containerRef.current, {
        animation: 100,
        delay: 300,
        delayOnTouchOnly: true,
        onChoose: (evt) => {
          holdTimeout.current = setTimeout(() => {
            dispatch(setEditNoteModal(true));
          }, 300);
        },
        onStart: function (evt) {
          clearTimeout(holdTimeout.current);
        },
        onMove: (evt) => {
          if (evt.related !== overFolder) {
            console.log('starting timeout')
            clearTimeout(swapTimeout.current);
            canSwapWithFolder = false;
            overFolder = evt.related;
            swapTimeout.current = setTimeout(() => {
              canSwapWithFolder = true;
            }, FOLDER_SWAP_TIMEOUT);
          } else if (canSwapWithFolder) {
            overFolder = null;
          }

          if (evt.related === overFolder && !canSwapWithFolder) {
            return false;
          }
        },
        onEnd: (evt) => {
          const { oldIndex, newIndex } = evt;
          handleSortEnd(oldIndex, newIndex);
        }
      });

      return () => {
        sortable.destroy();
      };
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleSortEnd]);

  return (
    <>
      <div ref={containerRef} className={css.conatainer}>
        {items.map(i => <div key={i.id} className={css.item}>{i.name}</div>)}
      </div>
      <Modal open={editNoteModal} close={() => dispatch(setEditNoteModal(false))}>

      </Modal>
    </>
  );
};

export default SortableComponent;