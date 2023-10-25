import cloneDeep from 'lodash/cloneDeep';

import { PersonalNotificationsActionsConstants } from '@/constants/actions/personal/personalNotifications';

import { createHandlers, createReducer } from '../handler';

const initialState = {
  getPersonalNotificationsInProcess: false,
  getPersonalNotificationsFromApi: false,
  personalNotifications: [],

  deletePersonalNotificationsInProcess: false,
};

const handlers = createHandlers({
  [PersonalNotificationsActionsConstants.GET_PERSONAL_NOTIFICATIONS_IN_PROCESS]: (
    state,
    { getPersonalNotificationsInProcess = false }
  ) => ({
    ...state,
    getPersonalNotificationsInProcess,
  }),
  [PersonalNotificationsActionsConstants.GET_PERSONAL_NOTIFICATIONS_SUCCESS]: (state, { personalNotifications = [] }) => ({
    ...state,
    personalNotifications,
    getPersonalNotificationsInProcess: false,
    getPersonalNotificationsFromApi: true,
  }),

  [PersonalNotificationsActionsConstants.DELETE_PERSONAL_NOTIFICATIONS_IN_PROCESS]: (
    state,
    { deletePersonalNotificationsInProcess = false }
  ) => ({
    ...state,
    deletePersonalNotificationsInProcess,
  }),
  [PersonalNotificationsActionsConstants.DELETE_PERSONAL_NOTIFICATIONS_SUCCESS]: (
    state,
    { notificationsIds = [], projectId }
  ) => {
    const { personalNotifications: personalNotificationsStore } = state;
    const personalNotifications = cloneDeep(personalNotificationsStore);

    notificationsIds.forEach((notificationId) => {
      const findNotificationIdx = personalNotifications.findIndex(
        ({ id, data: { projectId: findProjectId } = {} }) => findProjectId === projectId && notificationId === id
      );

      if (findNotificationIdx > -1) {
        personalNotifications.splice(findNotificationIdx, 1);
      }
    });

    return {
      ...state,
      personalNotifications,
      deletePersonalNotificationsInProcess: false,
    };
  },
});

const PersonalNotificationsReducer = (state = initialState, action) => createReducer(state, action, handlers);

export default PersonalNotificationsReducer;
