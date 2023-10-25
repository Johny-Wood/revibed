import { AuthActionsConstants } from '@/constants/actions/auth/auth';
import { PersonalActionsConstants } from '@/constants/actions/personal/personal';
import { PersonalNotificationCountsActionsConstants } from '@/constants/actions/personal/personalNotificationCounts';
import { WithdrawActionsConstants } from '@/constants/actions/personal/withdraw';
import { PersonalNotificationsSectionsConstants } from '@/constants/personal/notifications/sections';
import { PopupPersonalIdsConstants } from '@/constants/popups/id';
import { ProjectsLocationsConstants } from '@/constants/projects/location';
import { ProjectsNotificationLocationsConstants } from '@/constants/projects/notifications';
import { WebSocketUserEventsConstants } from '@/constants/websocket/user';
import { showPopupAction } from '@/redux-actions/components/popupActions';
import { getFeedRequestAction, updateFeedListPageAction } from '@/redux-actions/feedActions';
import { connectTgBotRequestAction } from '@/redux-actions/personal/personalActions';
import { deleteUnreadPersonalNotificationCountsEventAction } from '@/redux-actions/personal/personalNotificationCountsActions';
import {
  getPersonalUserNotificationsRequestAction,
  getShortPersonalUserNotificationsRequestAction,
  updatePersonalUserNotificationsAction,
  updateShortPersonalUserNotificationsAction,
} from '@/redux-actions/personal/personalUserNotificationsActions';
import { getWantListInfoRequestAction } from '@/redux-actions/wantList/wantListActions';
import { getWantListReleasesItemRequestAction } from '@/redux-actions/wantList/wantListReleasesItemsActions';
import ReduxStoreService from '@/services/ReduxStoreService';
import { logOutUtil } from '@/utils/auth/logOutUtil';
import { addProjectToStoreUtil } from '@/utils/project/projectsListUtil';
import {
  addShortUserNotificationItemToStoreUtil,
  addUserNotificationItemToStoreUtil,
} from '@/utils/user-notifications/userNotificationsUtil';

import { createWebsocketEvent, createWebsocketHandlers } from '../websocketHandler';

const handlers = createWebsocketHandlers({
  [WebSocketUserEventsConstants.NEW_PROJECT_EVENT]: (data) => {
    const { store } = ReduxStoreService.getInstance();
    const { projectId, sections } = data;

    sections.forEach((sectionLocation) => {
      if (
        ProjectsNotificationLocationsConstants.includes(sectionLocation) &&
        sectionLocation !== PersonalNotificationsSectionsConstants.PERSONAL_EVENTS_FEED
      ) {
        store.dispatch({
          type: PersonalNotificationCountsActionsConstants.ADD_UNREAD_EVENT,
          payload: {
            projectId,
            sections: [sectionLocation],
          },
        });
      }
    });
  },

  [WebSocketUserEventsConstants.DISCOGS_MARKETPLACE_NEW_ITEMS]: ({ ids = [] }) => {
    const { store } = ReduxStoreService.getInstance();

    if (ids.length > 0) {
      ids.forEach((projectId) => {
        store.dispatch({
          type: PersonalNotificationCountsActionsConstants.ADD_UNREAD_EVENT,
          payload: {
            projectId,
            sections: [PersonalNotificationsSectionsConstants.WANT_LIST_RELEASES_ITEMS],
          },
        });

        getWantListReleasesItemRequestAction({
          wantlistReleasesItemId: projectId,
        })(store.dispatch);
      });
    }
  },

  [WebSocketUserEventsConstants.CHANGE_USER_BALANCE]: (data) => {
    const { store } = ReduxStoreService.getInstance();
    const { balance, transactionId } = data;

    if (transactionId >= 0) {
      store.dispatch({
        type: PersonalNotificationCountsActionsConstants.ADD_UNREAD_EVENT,
        payload: {
          projectId: transactionId,
          sections: [PersonalNotificationsSectionsConstants.BALANCE],
        },
      });
    }

    store.dispatch({
      type: AuthActionsConstants.CHANGE_USER_BALANCE,
      payload: {
        balance,
      },
    });
  },

  [WebSocketUserEventsConstants.CHANGE_GEMS_COUNT]: (data) => {
    const { store } = ReduxStoreService.getInstance();
    const { gemsCount } = data;

    store.dispatch({
      type: AuthActionsConstants.CHANGE_GEMS_COUNT,
      payload: {
        gemsCount,
      },
    });
  },

  [WebSocketUserEventsConstants.CHANGE_GOLDEN_COINS_COUNT]: (data) => {
    const { store } = ReduxStoreService.getInstance();
    const { goldenCoinsCount } = data;

    store.dispatch({
      type: AuthActionsConstants.CHANGE_GOLDEN_COINS_COUNT,
      payload: {
        goldenCoinsCount,
      },
    });
  },

  [WebSocketUserEventsConstants.CHANGE_USER_TG_BOT_INFO]: (data) => {
    const { store } = ReduxStoreService.getInstance();
    const { tgActive, tgUsername } = data;

    store.dispatch({
      type: AuthActionsConstants.UPDATE_USER_INFO,
      payload: {
        userInfo: {
          tgActive,
          tgUsername,
        },
      },
    });

    store.dispatch({
      type: PersonalActionsConstants.CONNECT_TG_BOT_SET_CONFIRM_CODE,
      payload: {
        connectTgBotConfirmCode: null,
      },
    });
  },

  [WebSocketUserEventsConstants.EXECUTE_CONNECT_BOT_REQUEST]: ({ reset = false } = {}) => {
    const { store } = ReduxStoreService.getInstance();

    const { connectTgBotConfirmCode } = store.getState().PersonalReducer;

    if (!connectTgBotConfirmCode || reset) {
      store.dispatch(connectTgBotRequestAction());
    }
  },

  [WebSocketUserEventsConstants.RESET_TG_BOT_INFO]: () => {
    const { store } = ReduxStoreService.getInstance();

    store.dispatch({
      type: AuthActionsConstants.UPDATE_USER_INFO,
      payload: {
        userInfo: {
          tgActive: false,
          tgUsername: '',
        },
      },
    });

    store.dispatch({
      type: PersonalActionsConstants.CONNECT_TG_BOT_SET_CONFIRM_CODE,
      payload: {
        connectTgBotConfirmCode: null,
      },
    });
  },

  [WebSocketUserEventsConstants.WANTLIST_UPLOAD_CHANGE_STATUS]: (data) => {
    const { store } = ReduxStoreService.getInstance();

    // TODO what is timeout?
    if (data) {
      setTimeout(() => {
        store.dispatch(getWantListInfoRequestAction({ changeStatus: true }));
      }, 3000);
    }
  },

  [WebSocketUserEventsConstants.USER_WITHDRAW_CHANGE_STATUS]: (data) => {
    const { store } = ReduxStoreService.getInstance();

    const { id: withdrawId, status: withdrawStatus, textRejection } = data;

    if (data) {
      store.dispatch({
        type: PersonalNotificationCountsActionsConstants.ADD_UNREAD_EVENT,
        payload: {
          sections: ['WITHDRAW'],
          projectId: withdrawId,
        },
      });

      store.dispatch({
        type: WithdrawActionsConstants.WITHDRAW_CHANGE_STATUS,
        payload: {
          withdrawId,
          withdrawStatus,
          textRejection,
        },
      });
    }
  },

  [WebSocketUserEventsConstants.BANNED]: () => {
    const { store } = ReduxStoreService.getInstance();

    logOutUtil({ dispatch: store.dispatch });

    store.dispatch(showPopupAction(PopupPersonalIdsConstants.BannedUserPopup));
  },

  [WebSocketUserEventsConstants.PERSONAL_EVENTS_FEED_NEW_EVENT]: (data) => {
    const { id } = data || {};
    const { store } = ReduxStoreService.getInstance();

    const {
      getPersonalUserNotificationsFromApi,
      getShortPersonalUserNotificationsInfoFromApi,
      pageSettings: { currentNumber = 0 } = {},
    } = store.getState().PersonalUserNotificationsReducer;

    store.dispatch({
      type: PersonalNotificationCountsActionsConstants.ADD_UNREAD_EVENT,
      payload: {
        projectId: id,
        sections: [PersonalNotificationsSectionsConstants.PERSONAL_EVENTS_FEED],
      },
    });

    if (getPersonalUserNotificationsFromApi && currentNumber === 0) {
      addUserNotificationItemToStoreUtil({
        item: data,
        updateAction: updatePersonalUserNotificationsAction,
        listRequest: getPersonalUserNotificationsRequestAction,
      });
    }

    if (getShortPersonalUserNotificationsInfoFromApi) {
      addShortUserNotificationItemToStoreUtil({
        item: data,
        updateAction: updateShortPersonalUserNotificationsAction,
        listRequest: getShortPersonalUserNotificationsRequestAction,
      });
    }
  },

  [WebSocketUserEventsConstants.CUSTOM_FEED_EVENT]: (data) => {
    const { store } = ReduxStoreService.getInstance();

    const { type, item, item: { id: newEventId } = {}, ids = [] } = data || {};

    if (type === 'NEW_ITEM') {
      store.dispatch({
        type: PersonalNotificationCountsActionsConstants.ADD_UNREAD_EVENT,
        payload: {
          sections: [PersonalNotificationsSectionsConstants.CUSTOM_FEED],
          projectId: newEventId,
        },
      });

      addProjectToStoreUtil({
        location: ProjectsLocationsConstants.MY_FEED,
        listRequest: getFeedRequestAction,
        updateAction: updateFeedListPageAction,
        item,
      });
    } else if (type === 'REMOVE_ITEMS') {
      const { pageSettings: { currentNumber, size } = {} } = store.getState().MyFeedReducer || {};

      getFeedRequestAction({
        pageNumber: 0,
        pageSize: currentNumber + 1 * size,
        dispatch: store.dispatch,
      }).then(() => {
        store.dispatch(
          deleteUnreadPersonalNotificationCountsEventAction(ids, {
            deleteFromAllProjects: false,
            location: ProjectsLocationsConstants.MY_FEED,
          })
        );
      });
    }
  },
});

const WebsocketUserEvents = (eventName, data, callbackData) => createWebsocketEvent(eventName, data, handlers, callbackData);

export default WebsocketUserEvents;
