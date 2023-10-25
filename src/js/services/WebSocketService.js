import { Stomp } from '@stomp/stompjs';
import cloneDeep from 'lodash/cloneDeep';
import SockJS from 'sockjs-client';

import { WebsocketActionsConstants } from '@/constants/actions/websocket';

import ReduxStoreService from './ReduxStoreService';

const webSocketAddSubscribeBeforeConnect = ({
  category,
  webSocketSubscriptionId,
  subscribeName,
  subscribeHeaders,
  callbackData,
}) => {
  const { store } = ReduxStoreService.getInstance();

  const subscribe = {
    webSocketSubscriptionId,
    subscribeName,
    subscribeHeaders,
    callbackData,
  };

  store.dispatch({
    type: WebsocketActionsConstants.ADD_SUBSCRIBE_BEFORE_CONNECT,
    payload: {
      subscribe,
      category,
    },
  });
};

const WebSocketService = (() => {
  let socketClient;
  let connected = false;
  let connectInProcess = false;
  let connectCallbacks = [];
  let webSocketSubscriptions = {};
  let subscribeCallback = {};

  const webSocketSubscribe = ({
    category,
    webSocketSubscriptionId = 1,
    subscribeName,
    subscribeHeaders,
    callbackData,
    callback,
  }) => {
    if (!socketClient || !connected) {
      webSocketAddSubscribeBeforeConnect({
        category,
        webSocketSubscriptionId,
        subscribeName,
        subscribeHeaders,
        callbackData,
        callback,
      });

      return;
    }

    if (!subscribeName) {
      console.error('subscribeName - is undefined');
    }

    if (!category) {
      console.error('category - is undefined');
    }

    const subscriptionCategory = webSocketSubscriptions[category] || [];

    const foundSubscriptionIdx = subscriptionCategory.findIndex(
      ({ id: subscriptionId }) => subscriptionId === webSocketSubscriptionId
    );

    if (socketClient && socketClient.subscribe && (subscriptionCategory.length <= 0 || foundSubscriptionIdx === -1)) {
      const subscription = socketClient.subscribe(
        subscribeName,
        (message) => {
          const jsonMessage = JSON.parse(message.body);
          const { event, data } = jsonMessage;

          subscribeCallback[category](event, data, {
            ...callbackData,
            webSocketSubscriptionId,
          });
        },
        subscribeHeaders
      );

      if (callback) {
        callback({
          callbackData,
          socketClient,
        });
      }

      webSocketSubscriptions = {
        ...webSocketSubscriptions,
        [category]: webSocketSubscriptions[category]
          ? [
              ...webSocketSubscriptions[category],
              {
                ...subscription,
                id: webSocketSubscriptionId,
              },
            ]
          : [
              {
                ...subscription,
                id: webSocketSubscriptionId,
              },
            ],
      };
    }
  };

  const webSocketUnsubscribe = ({ category, webSocketSubscriptionIds, unsubscribeCallback }) => {
    if (category && webSocketSubscriptions && webSocketSubscriptions[category]) {
      if (webSocketSubscriptionIds.length > 0) {
        const webSocketSubscriptionsTmp = cloneDeep(webSocketSubscriptions[category]);

        webSocketSubscriptionIds.forEach((webSocketSubscriptionId) => {
          const findIdx = webSocketSubscriptionsTmp.findIndex(({ id }) => id === webSocketSubscriptionId);

          if (findIdx > -1) {
            webSocketSubscriptionsTmp[findIdx].unsubscribe();
            webSocketSubscriptionsTmp.splice(findIdx, 1);
          }
        });

        webSocketSubscriptions[category] = webSocketSubscriptionsTmp;

        unsubscribeCallback();
      } else {
        unsubscribeCallback();
      }
    } else {
      unsubscribeCallback();
    }
  };

  const webSocketConnect = ({ callback, subscribeHandlers } = {}) => {
    socketClient = Stomp.over(() => new SockJS(`${process.env.NEXT_STATIC_WS_APP_URL}`)) || undefined;

    if (socketClient && process.env.NEXT_STATIC_WS_LOGS_ENABLED !== 'true') {
      socketClient.debug = () => {};
    }

    connectInProcess = true;

    subscribeCallback = subscribeHandlers;

    socketClient.connect(
      {},
      () => {
        console.log('WEBSOCKET CONNECT__');
        const { store } = ReduxStoreService.getInstance();
        const { webSocketSubscriptionsBeforeConnect } = store.getState().WebsocketSubscribeReducer;

        connected = true;
        connectInProcess = false;

        if (connectCallbacks.length > 0) {
          connectCallbacks.forEach((connectCallback) => {
            connectCallback();
          });

          connectCallbacks = [];

          return;
        }

        Object.keys(webSocketSubscriptionsBeforeConnect).forEach((subscribeCategory) => {
          webSocketSubscriptionsBeforeConnect[subscribeCategory].forEach(
            ({ webSocketSubscriptionId, subscribeName, subscribeHeaders, callbackData, callback: c }) => {
              webSocketSubscribe({
                category: subscribeCategory,
                webSocketSubscriptionId,
                subscribeName,
                subscribeHeaders,
                callbackData,
                c,
              });
            }
          );
        });

        store.dispatch({
          type: WebsocketActionsConstants.CLEAR_SUBSCRIBES_BEFORE_CONNECT,
        });

        if (callback) {
          callback();
        }
      },
      () => {
        console.error('WEBSOCKET CONNECT ERROR__');
        connected = false;
        connectInProcess = false;
      },
      () => {
        console.error('WEBSOCKET ERROR__');
        connected = false;
        connectInProcess = false;
      }
    );
  };

  const webSocketDisconnect = (callback = () => {}) => {
    const disconnectFunction = () => {
      socketClient.disconnect(() => {
        webSocketSubscriptions = {};
        connected = false;
        connectInProcess = false;
        callback();
      });
    };

    if (connectInProcess) {
      connectCallbacks.push(disconnectFunction);
    } else if (socketClient) {
      disconnectFunction();
    }
  };

  return {
    socketClient: () => socketClient,
    connect: ({ callback, subscribeHandlers }) => {
      webSocketConnect({ callback, subscribeHandlers });
    },
    disconnect: (callback) => {
      webSocketDisconnect(callback);
    },
    getInstance: (category) => {
      const webSocketSubscriptionsIds = [];

      (webSocketSubscriptions[category] || []).forEach(({ id }) => {
        webSocketSubscriptionsIds.push(id);
      });

      return webSocketSubscriptionsIds;
    },
    subscribe: ({ category, webSocketSubscriptionId, subscribeName, subscribeHeaders, callbackData, callback }) => {
      webSocketSubscribe({
        category,
        webSocketSubscriptionId,
        subscribeName,
        subscribeHeaders,
        callbackData,
        callback,
      });
    },
    unsubscribe: ({ category, webSocketSubscriptionIds, unsubscribeCallback = () => {} }) => {
      webSocketUnsubscribe({
        category,
        webSocketSubscriptionIds,
        unsubscribeCallback,
      });
    },
  };
})();

export default WebSocketService;
