import { composeWithDevTools } from '@redux-devtools/extension';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from '../redux/reducers';

const ReduxStoreService = (() => {
  let instance = null;

  const init = (initialStore) => {
    const store =
      process.env.NEXT_STATIC_BUILD_PROFILE === 'production'
        ? createStore(rootReducer, initialStore, applyMiddleware(thunk))
        : createStore(rootReducer, initialStore, composeWithDevTools(applyMiddleware(thunk)));

    return {
      store,
    };
  };

  return {
    getInstance: () => {
      if (!instance) {
        throw new Error('Redux store service not initialized');
      }

      return instance;
    },
    init: (initialStore) => {
      instance = init(initialStore);

      return instance.store;
    },
  };
})();

export default ReduxStoreService;
