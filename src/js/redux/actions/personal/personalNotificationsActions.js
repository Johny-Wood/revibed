import api from '@/api';
import { PersonalNotificationsActionsConstants } from '@/constants/actions/personal/personalNotifications';

import createAction from '../actionCreator';

const getPersonalNotificationsInProcessAction = (getPersonalNotificationsInProcess) =>
  createAction(PersonalNotificationsActionsConstants.GET_PERSONAL_NOTIFICATIONS_IN_PROCESS, {
    getPersonalNotificationsInProcess,
  });

const getPersonalNotificationsSuccessAction = (personalNotifications) =>
  createAction(PersonalNotificationsActionsConstants.GET_PERSONAL_NOTIFICATIONS_SUCCESS, {
    personalNotifications,
  });

export const getPersonalNotificationsRequestAction = ({ dispatch }) =>
  new Promise((resolve) => {
    dispatch(getPersonalNotificationsInProcessAction(true));

    api
      .get('personal/notifications')
      .then(({ data: { data: personalNotifications = {} } = {} }) => {
        dispatch(getPersonalNotificationsSuccessAction(personalNotifications));

        resolve();
      })
      .catch(() => {
        dispatch(getPersonalNotificationsInProcessAction(false));
      });
  });

const deletePersonalNotificationsInProcessAction = (deletePersonalNotificationsInProcess) =>
  createAction(PersonalNotificationsActionsConstants.DELETE_PERSONAL_NOTIFICATIONS_IN_PROCESS, {
    deletePersonalNotificationsInProcess,
  });

const deletePersonalNotificationsSuccessAction = (notificationsIds, projectId) =>
  createAction(PersonalNotificationsActionsConstants.DELETE_PERSONAL_NOTIFICATIONS_SUCCESS, {
    notificationsIds,
    projectId,
  });

export const deletePersonalNotificationsRequestAction =
  ({ notificationsIds = [], projectId }) =>
  (dispatch) =>
    new Promise((resolve) => {
      dispatch(deletePersonalNotificationsInProcessAction(true));

      api
        .delete('personal/notifications', {
          data: notificationsIds,
        })
        .then(() => {
          dispatch(deletePersonalNotificationsSuccessAction(notificationsIds, projectId));

          resolve();
        })
        .catch(() => {
          dispatch(deletePersonalNotificationsInProcessAction(false));
        });
    });
