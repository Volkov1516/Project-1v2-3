import css from './Notes.module.css';

export const Notes = ({ notes }) => {
  const handleTouchStart = (e) => {
    const element = e.currentTarget;
    element.classList.add(css.touch);
  };

  const handleTouchEnd = (e) => {
    const element = e.currentTarget;
    element.classList.remove(css.touch);
  }

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
        </div>
      ))}
    </div>
  );
};
