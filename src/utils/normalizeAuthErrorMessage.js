export const normalizeAuthErrorMessage = (error, setErrorMessage) => {
  const errorCode = error.code;
  const normalizedMessage = errorCode?.slice(5).split('-').join(' ');
  const firstLetterToUpperCase = normalizedMessage.charAt(0).toUpperCase() + normalizedMessage.slice(1);
  setErrorMessage(firstLetterToUpperCase);
};
