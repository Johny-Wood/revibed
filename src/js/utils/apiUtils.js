export const extractErrorDataFromResponseApiUtil = (error) => {
  const { response: { data = { error: 'API_ERROR' } } = {} } = error;

  return { data };
};

export const handleErrorUtil = (error, handlers, defaultHandler = () => {}) => {
  const handler = handlers[error] || handlers.DEFAULT || defaultHandler;

  if (handler) {
    handler();
  }
};
