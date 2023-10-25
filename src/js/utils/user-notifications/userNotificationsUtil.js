import size from 'lodash/size';

import ReduxStoreService from '@/services/ReduxStoreService';

import { addItemToListByStoreUtil } from '../listUtils';

export const addUserNotificationItemToStoreUtil = ({ item, updateAction, listRequest }) => {
  const { store } = ReduxStoreService.getInstance();

  const {
    getPersonalUserNotificationsFromApi = false,
    personalUserNotifications = [],
    pageSettings,
  } = store.getState().PersonalUserNotificationsReducer || {};

  addItemToListByStoreUtil({
    item,
    list: personalUserNotifications,
    listPageSettingsFromStore: pageSettings,
    requestFromApi: getPersonalUserNotificationsFromApi,
    updateAction,
    listRequest,
  });
};

export const addShortUserNotificationItemToStoreUtil = ({ item, updateAction, listRequest }) => {
  const { store } = ReduxStoreService.getInstance();

  const {
    getShortPersonalUserNotificationsInfoFromApi = false,
    shortPersonalUserNotifications = [],
    shortPageSettings,
  } = store.getState().PersonalUserNotificationsReducer || {};

  addItemToListByStoreUtil({
    item,
    list: shortPersonalUserNotifications,
    listPageSettingsFromStore: shortPageSettings,
    requestFromApi: getShortPersonalUserNotificationsInfoFromApi,
    updateAction,
    listRequest,
  });
};

export const notificationCountsMapUtil = ({
  adminUnreadMessagesCount = 0,
  newArrivalsIds = [],
  unreadEvents = [],
  variablesList = {},
}) => {
  const {
    NEW_ARRIVALS = {},
    BALANCE = {},
    WITHDRAW = {},
    PROJECTS_EVENTS = {},
    WANT_LIST_RELEASES_ITEMS = {},
    MY_PROJECTS = {},
    IN_MODERATION = {},
    PERSONAL_EVENTS_FEED = {},
    CUSTOM_FEED = {},
  } = unreadEvents[0] || {};

  const { UNREAD_MARKER_BALANCE_ENABLED, UNREAD_MARKER_PROJECTS_ENABLED, UNREAD_MARKER_CONTACT_ADMIN_ENABLED } = variablesList;

  return {
    NEW_ARRIVALS: Object.keys(NEW_ARRIVALS).filter((keyId) => newArrivalsIds.includes(+keyId)).length,
    PROJECTS_EVENTS: size(PROJECTS_EVENTS),
    WITHDRAW: size(WITHDRAW),
    BALANCE: UNREAD_MARKER_BALANCE_ENABLED
      ? size(WITHDRAW) + size(BALANCE) + (BALANCE[-1] && BALANCE[-1] > 0 ? BALANCE[-1] - 1 : 0)
      : 0,
    WANT_LIST_RELEASES_ITEMS: size(WANT_LIST_RELEASES_ITEMS),
    CONTACT_ADMIN: UNREAD_MARKER_CONTACT_ADMIN_ENABLED ? adminUnreadMessagesCount : 0,
    MY_PROJECTS: UNREAD_MARKER_PROJECTS_ENABLED ? size(MY_PROJECTS) : 0,
    MY_PROJECTS_IN_MODERATION: UNREAD_MARKER_PROJECTS_ENABLED ? size(IN_MODERATION) : 0,
    PERSONAL_EVENTS_FEED: size(PERSONAL_EVENTS_FEED),
    CUSTOM_FEED: size(CUSTOM_FEED),
  };
};
