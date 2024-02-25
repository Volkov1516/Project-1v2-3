import { useState } from 'react';

import { IconButton } from 'components/atoms/IconButton/IconButton';
import { Input } from 'components/atoms/Input/Input';
import { Button } from 'components/atoms/Button/Button';
import { Modal } from 'components/atoms/Modal/Modal';

import css from './Notes.module.css';

export const Notes = ({ notes }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [noteId, setNoteId] = useState(null);
  const [titleInputValue, setTitleInput] = useState('');
  const [titleInputValueDelete, setTitleInputDelete] = useState('');

  const handleTouchStart = (e) => {
    const element = e.currentTarget;
    element.classList.add(css.touch);
  };

  const handleTouchEnd = (e) => {
    const element = e.currentTarget;
    element.classList.remove(css.touch);
  }

  const handleOpenEditNoteModal = (e, id, title) => {
    setNoteId(id);
    console.log(noteId);
    setTitleInput(title);
    setOpen(true);
  };

  const handleEditTitle = () => {
    setLoading(false);
  };

  const handleDeleteNote = () => {};

  return (
    <div className={css.container}>
      {notes?.map((i) => (
        <div
          key={i.id}
          className={css.note}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {i.title}
          <span className={css.settings}>
            <IconButton onClick={(e) => handleOpenEditNoteModal(e, i.id, i.title)} small path="M480-218.461q-16.5 0-28.25-11.75T440-258.461q0-16.501 11.75-28.251t28.25-11.75q16.5 0 28.25 11.75T520-258.461q0 16.5-11.75 28.25T480-218.461ZM480-440q-16.5 0-28.25-11.75T440-480q0-16.5 11.75-28.25T480-520q16.5 0 28.25 11.75T520-480q0 16.5-11.75 28.25T480-440Zm0-221.538q-16.5 0-28.25-11.75T440-701.539q0-16.5 11.75-28.25t28.25-11.75q16.5 0 28.25 11.75t11.75 28.25q0 16.501-11.75 28.251T480-661.538Z" />
          </span>
        </div>
      ))}
      <Modal
        loading={loading}
        open={open}
        setOpen={setOpen}
      >
        <div className={css.eiditNoteModalContent}>
          <Input label="Edit note title" placeholder="Enter folder name" value={titleInputValue} onChange={e => setTitleInput(e.target.value)} />
          <Button text="Rename folder" disabled={!titleInputValue} onClick={handleEditTitle} />
          <Input label={`Enter ${titleInputValue} to delete the note`} placeholder="Enter folder name" value={titleInputValueDelete} onChange={e => setTitleInputDelete(e.target.value)} />
          <Button text="Delete folder" disabled={!titleInputValueDelete} onClick={handleDeleteNote} />
        </div>
      </Modal>
    </div>
  );
};
