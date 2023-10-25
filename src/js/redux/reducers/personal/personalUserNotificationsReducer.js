import cloneDeep from 'lodash/cloneDeep';

import { PersonalUserNotificationsActionsConstants } from '@/constants/actions/personal/personalUserNotifications';

import { createHandlers, createReducer } from '../handler';

const initialState = {
  getPersonalUserNotificationsInProcess: false,
  getPersonalUserNotificationsFromApi: false,
  personalUserNotifications: [],
  pageSettings: {},

  getShortPersonalUserNotificationsInProcess: false,
  getShortPersonalUserNotificationsInfoFromApi: false,
  shortPersonalUserNotifications: [],
  shortPageSettings: {},
  newShortPersonalUserNotificationsDate: 0,
};

const handlers = createHandlers({
  [PersonalUserNotificationsActionsConstants.GET_PERSONAL_USER_NOTIFICATIONS_IN_PROCESS]: (
    state,
    { getPersonalUserNotificationsInProcess = false }
  ) => ({
    ...state,
    getPersonalUserNotificationsInProcess,
  }),
  [PersonalUserNotificationsActionsConstants.GET_PERSONAL_USER_NOTIFICATIONS_SUCCESS]: (
    state,
    { personalUserNotifications = [], position, pageSettings: { page = {} } = {} }
  ) => {
    if (position === 'LAST') {
      return {
        ...state,
        ...state,
        getPersonalUserNotificationsInProcess: false,
        personalUserNotifications: [...state.personalUserNotifications, ...personalUserNotifications],
      };
    }

    if (position === 'FIRST') {
      return {
        ...state,
        ...state,
        getPersonalUserNotificationsInProcess: false,
        personalUserNotifications: [...personalUserNotifications, ...state.personalUserNotifications],
      };
    }

    return {
      ...state,
      getPersonalUserNotificationsInProcess: false,
      getPersonalUserNotificationsFromApi: true,
      personalUserNotifications,
      pageSettings: page,
    };
  },

  [PersonalUserNotificationsActionsConstants.UPDATE_PERSONAL_USER_NOTIFICATIONS]: (state, { items = [], pageSettings = {} }) => ({
    ...state,
    personalUserNotifications: items,
    pageSettings,
  }),

  [PersonalUserNotificationsActionsConstants.UPDATE_SHORT_PERSONAL_USER_NOTIFICATIONS]: (
    state,
    { items = [], pageSettings = {} }
  ) => ({
    ...state,
    shortPersonalUserNotifications: items,
    shortPageSettings: pageSettings,
    newShortPersonalUserNotificationsDate: new Date().valueOf(),
  }),

  [PersonalUserNotificationsActionsConstants.GET_SHORT_PERSONAL_USER_NOTIFICATIONS_IN_PROCESS]: (
    state,
    { getShortPersonalUserNotificationsInProcess = false }
  ) => ({
    ...state,
    getShortPersonalUserNotificationsInProcess,
  }),

  [PersonalUserNotificationsActionsConstants.GET_SHORT_PERSONAL_USER_NOTIFICATIONS_SUCCESS]: (
    state,
    { withoutSave, shortPersonalUserNotifications = [], shortPageSettings = {} }
  ) => ({
    ...state,
    shortPersonalUserNotifications: !withoutSave ? shortPersonalUserNotifications : state.shortPersonalUserNotifications,
    getShortPersonalUserNotificationsInProcess: false,
    getShortPersonalUserNotificationsInfoFromApi: true,
    shortPageSettings: !withoutSave ? shortPageSettings : state.shortPageSettings,
  }),

  [PersonalUserNotificationsActionsConstants.UPDATE_PERSONAL_USER_NOTIFICATION]: (state, { targetId = -1, data = {} }) => {
    const personalUserNotificationsTmp = cloneDeep(state.personalUserNotifications);
    const shortPersonalUserNotificationsTmp = cloneDeep(state.shortPersonalUserNotifications);

    personalUserNotificationsTmp.forEach(({ target: { id } = {} }, idx) => {
      if (targetId === id) {
        personalUserNotificationsTmp[idx] = {
          ...personalUserNotificationsTmp[idx],
          ...data,
        };
      }
    });

    shortPersonalUserNotificationsTmp.forEach(({ target: { id } = {} }, idx) => {
      if (targetId === id) {
        shortPersonalUserNotificationsTmp[idx] = {
          ...shortPersonalUserNotificationsTmp[idx],
          ...data,
        };
      }
    });

    return {
      ...state,
      personalUserNotifications: personalUserNotificationsTmp,
      shortPersonalUserNotifications: shortPersonalUserNotificationsTmp,
    };
  },
});

const PersonalUserNotificationsReducer = (state = initialState, action) => createReducer(state, action, handlers);

export default PersonalUserNotificationsReducer;
