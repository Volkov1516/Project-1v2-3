import {useState, useEffect} from 'react';

import css from './Widgets.module.css';

export const Widgets = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={css.container}>
      {time.getHours() + ":" + (time.getMinutes() < 10 ? ("0" + time.getMinutes()) : time.getMinutes()) + ":" + (time.getSeconds() < 10 ? ("0" + time.getSeconds()) : time.getSeconds())}
    </div>
  );
};
