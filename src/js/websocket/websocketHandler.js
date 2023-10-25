const createWebsocketHandlers = (handlers) => () => ({
  DEFAULT: () => {},
  ...handlers,
});

const createWebsocketEvent = (eventName, data, actionHandlers, callbackData) => {
  const handlers = actionHandlers();
  const handler = handlers[eventName] || handlers.DEFAULT;

  return handler(data, callbackData);
};

export { createWebsocketEvent, createWebsocketHandlers };
