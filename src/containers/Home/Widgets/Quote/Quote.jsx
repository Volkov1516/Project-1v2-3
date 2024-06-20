import { useState, useEffect } from 'react';

import css from './Quote.module.css';

import { quotes } from 'utils/quotes';

export const Quote = () => {
  const [quote, setQuote] = useState({ text: '', author: '' });

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
  }, []);

  return (
    <div className={css.container}>
      <div className={css.text}>"{quote.text}"</div>
      <div className={css.author}>{quote.author}</div>
    </div>
  );
};
