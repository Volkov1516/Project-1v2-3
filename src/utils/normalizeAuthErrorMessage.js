export const normalizeAuthErrorMessage = (error) => {
  const errorCode = error.code;

  if (!errorCode) return 'An unknown error occurred. Please try again.';

  const normalizedMessage = errorCode?.slice(5).split('-').join(' ');
  const firstLetterToUpperCase = normalizedMessage.charAt(0).toUpperCase() + normalizedMessage.slice(1);

  return firstLetterToUpperCase;
};
