import cloneDeep from 'lodash/cloneDeep';

import { EventsActionsConstants } from '@/constants/actions/common/events';
import EventsLocationsConstants from '@/constants/events/location';
import { WebSocketGlobalEventsConstants } from '@/constants/websocket/globalEvents';
import { getArtistFundRequestAction } from '@/redux-actions/artistFundActions';
import ReduxStoreService from '@/services/ReduxStoreService';

import { createWebsocketEvent, createWebsocketHandlers } from '../websocketHandler';

const fundingNowEvent = ({ data }) => {
  const { store } = ReduxStoreService.getInstance();

  const {
    VariablesReducer: { variablesList: { FUNDING_NOW_PROJECTS_LIMIT } = {} } = {},
    FundingNowEventsReducer: { events = [] } = {},
  } = store.getState();

  const eventsReverse = cloneDeep(events).reverse();
  const lastEvent = eventsReverse[0] || {};
  const { id: lastEventId } = lastEvent;
  const removeId = events.length >= FUNDING_NOW_PROJECTS_LIMIT ? lastEventId : -1;
  const lastBeforeDeleteVisibilityEvent = removeId > -1 ? eventsReverse[1] : eventsReverse[0];
  const { id: lastBeforeDeleteVisibilityId } = lastBeforeDeleteVisibilityEvent || {};

  store.dispatch({
    type: `${EventsLocationsConstants.FUNDING_NOW}_${EventsActionsConstants.PROJECT_NEW_CUT}`,
    payload: {
      data,
      removeId,
      lastBeforeDeleteVisibilityId,
      size: FUNDING_NOW_PROJECTS_LIMIT,
    },
  });
};

const handlers = createWebsocketHandlers({
  [WebSocketGlobalEventsConstants.GLOBAL_EVENT_PROJECT_NEW_CUT]: (data) => {
    fundingNowEvent({ data });
  },
  [WebSocketGlobalEventsConstants.GLOBAL_EVENT_PROJECT_PROMOTION]: (data) => {
    fundingNowEvent({ data });
  },
  [WebSocketGlobalEventsConstants.GLOBAL_EVENT_PROJECT_MEDIA_SECURED]: (data) => {
    fundingNowEvent({ data });
  },
  [WebSocketGlobalEventsConstants.GLOBAL_EVENT_MARKETPLACE_GOODS_USER_PURCHASE_GOODS]: (data) => {
    fundingNowEvent({ data });
  },
  // [WebSocketGlobalEventsConstants.GLOBAL_EVENT_PROJECT_PUBLISHED]: (data) => {
  //   const { store } = ReduxStoreService.getInstance();
  //   const { value: { id: projectId } = {} } = data;
  //   const awaitPromises = [];
  //
  //   awaitPromises.push(
  //     getShortProjectCardRequestAction({
  //       projectId,
  //       type: 'SHORT',
  //       dispatch: store.dispatch,
  //     })
  //   );
  //
  //   Promise.all(awaitPromises).then((promisePramsArray = []) => {
  //     const [promisePrams] = promisePramsArray;
  //     const { newProject } = promisePrams;
  //     const { variablesList: { NEW_ARRIVALS_PROJECTS_LIMIT } = {} } = store.getState().VariablesReducer;
  //     const { projects: projectsFromStore = [] } = store.getState().NewArrivalsProjectsReducer;
  //     let removeId = -1;
  //
  //     if (!newProject) {
  //       return;
  //     }
  //
  //     const projects = cloneDeep(projectsFromStore);
  //     projects.unshift(newProject);
  //
  //     if (NEW_ARRIVALS_PROJECTS_LIMIT && projects.length > NEW_ARRIVALS_PROJECTS_LIMIT) {
  //       removeId = projects[projects.length - 1].id;
  //       const webSocketSubscriptionIds = removeId >= 0 ? [removeId] : [];
  //
  //       projects.pop();
  //       unsubscribeProjectUtil({ webSocketSubscriptionIds });
  //     }
  //
  //     store.dispatch({
  //       type: `${ProjectsLocationsConstants.NEW_ARRIVALS}_${EventsActionsConstants.PROJECT_PUBLISHED}`,
  //       payload: {
  //         projects,
  //         newProject,
  //         removeId,
  //       },
  //     });
  //   });
  // },
  [WebSocketGlobalEventsConstants.GLOBAL_EVENT_NEW_LAST_RIPPED_PROJECT]: (data) => {
    const { store } = ReduxStoreService.getInstance();
    const { VariablesReducer: { variablesList: { LAST_RIPPED_PROJECTS_LIMIT } = {} } = {} } = store.getState();

    store.dispatch({
      type: `${EventsLocationsConstants.LAST_RIPPED}_${EventsActionsConstants.GLOBAL_EVENT_NEW_LAST_RIPPED_PROJECT}`,
      payload: {
        data,
        size: LAST_RIPPED_PROJECTS_LIMIT,
      },
    });

    getArtistFundRequestAction({ dispatch: store.dispatch }).then();
  },
  [WebSocketGlobalEventsConstants.GLOBAL_EVENT_RELOAD_LAST_RIPPED_PROJECTS]: (data) => {
    const { store } = ReduxStoreService.getInstance();
    const { VariablesReducer: { variablesList: { LAST_RIPPED_PROJECTS_LIMIT } = {} } = {} } = store.getState();

    store.dispatch({
      type: `${EventsLocationsConstants.LAST_RIPPED}_${EventsActionsConstants.GLOBAL_EVENT_RELOAD_LAST_RIPPED_PROJECTS}`,
      payload: {
        data,
        size: LAST_RIPPED_PROJECTS_LIMIT,
      },
    });
  },
});

const WebsocketGlobalEvents = (eventName, data, callbackData) => createWebsocketEvent(eventName, data, handlers, callbackData);

export default WebsocketGlobalEvents;
