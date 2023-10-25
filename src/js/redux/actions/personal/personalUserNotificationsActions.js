import qs from 'qs';

import api from '@/api';
import { PersonalUserNotificationsActionsConstants } from '@/constants/actions/personal/personalUserNotifications';
import { CommonVariablesConstants } from '@/constants/common/variables';
import ReduxStoreService from '@/services/ReduxStoreService';
import { extractErrorDataFromResponseApiUtil } from '@/utils/apiUtils';

import createAction from '../actionCreator';

const getShortPersonalUserNotificationsInProcessAction = ({ getShortPersonalUserNotificationsInProcess }) =>
  createAction(PersonalUserNotificationsActionsConstants.GET_SHORT_PERSONAL_USER_NOTIFICATIONS_IN_PROCESS, {
    getShortPersonalUserNotificationsInProcess,
  });

const getShortPersonalUserNotificationsSuccessAction = ({ withoutSave, shortPersonalUserNotifications, shortPageSettings }) =>
  createAction(PersonalUserNotificationsActionsConstants.GET_SHORT_PERSONAL_USER_NOTIFICATIONS_SUCCESS, {
    shortPersonalUserNotifications,
    shortPageSettings,
    withoutSave,
  });

export const getShortPersonalUserNotificationsRequestAction = ({ withoutSave, pageNumber, cookie, dispatch }) =>
  new Promise((resolve) => {
    const { store } = ReduxStoreService.getInstance();

    const { shortPageSettings: { currentNumber } = {} } = store.getState().PersonalUserNotificationsReducer || {};

    dispatch(
      getShortPersonalUserNotificationsInProcessAction({
        getShortPersonalUserNotificationsInProcess: true,
      })
    );

    api
      .get('personal/events/feed', {
        headers: cookie
          ? {
              [CommonVariablesConstants.AUTH_TOKEN_COOKIE_NAME]: cookie,
            }
          : undefined,
        params: {
          size: 10,
          page: pageNumber || pageNumber === 0 ? pageNumber : currentNumber,
          requestType: 'SHORT',
        },
        paramsSerializer(params) {
          return qs.stringify(params, { arrayFormat: 'repeat' });
        },
      })
      .then(({ data: { data: shortPersonalUserNotifications = [], payload: { page: shortPageSettings } } = {} }) => {
        dispatch(
          getShortPersonalUserNotificationsSuccessAction({
            shortPersonalUserNotifications,
            shortPageSettings,
            withoutSave,
          })
        );
        resolve({ list: shortPersonalUserNotifications, pageSettings: shortPageSettings });
      })
      .catch((error) => {
        console.error(error);

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);

        dispatch(
          getShortPersonalUserNotificationsInProcessAction({
            getShortPersonalUserNotificationsInProcess: false,
          })
        );

        resolve(errorData);
      });
  });

const getPersonalUserNotificationsInProcessAction = ({ getPersonalUserNotificationsInProcess }) =>
  createAction(PersonalUserNotificationsActionsConstants.GET_PERSONAL_USER_NOTIFICATIONS_IN_PROCESS, {
    getPersonalUserNotificationsInProcess,
  });

const getPersonalUserNotificationsSuccessAction = ({ personalUserNotifications, pageSettings, position }) =>
  createAction(PersonalUserNotificationsActionsConstants.GET_PERSONAL_USER_NOTIFICATIONS_SUCCESS, {
    personalUserNotifications,
    pageSettings,
    position,
  });

export const getPersonalUserNotificationsRequestAction = ({
  withInProcess = true,
  position,
  pageSize,
  pageNumber,
  cookie,
  dispatch,
}) =>
  new Promise((resolve) => {
    const { store } = ReduxStoreService.getInstance();

    const { pageSettings: { page: { size, page } = {} } = {} } = store.getState().PersonalUserNotificationsReducer || {};

    if (withInProcess) {
      dispatch(getPersonalUserNotificationsInProcessAction({ getPersonalUserNotificationsInProcess: true }));
    }

    api
      .get('personal/events/feed', {
        headers: cookie
          ? {
              [CommonVariablesConstants.AUTH_TOKEN_COOKIE_NAME]: cookie,
            }
          : undefined,
        params: {
          size: pageSize || size,
          page: pageNumber || pageNumber === 0 ? pageNumber : page,
        },
        paramsSerializer(params) {
          return qs.stringify(params, { arrayFormat: 'repeat' });
        },
      })
      .then(({ data: { data: personalUserNotifications = [], payload: pageSettings = {} } = {} }) => {
        dispatch(
          getPersonalUserNotificationsSuccessAction({
            personalUserNotifications,
            pageSettings,
            position,
          })
        );
        resolve();
      })
      .catch((error) => {
        console.error(error);

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);

        dispatch(
          getPersonalUserNotificationsInProcessAction({
            getPersonalUserNotificationsInProcess: false,
          })
        );

        resolve(errorData);
      });
  });

export const updatePersonalUserNotificationsAction = ({ items, pageSettings }) =>
  createAction(PersonalUserNotificationsActionsConstants.UPDATE_PERSONAL_USER_NOTIFICATIONS, {
    items,
    pageSettings,
  });

export const updateShortPersonalUserNotificationsAction = ({ items, pageSettings }) =>
  createAction(PersonalUserNotificationsActionsConstants.UPDATE_SHORT_PERSONAL_USER_NOTIFICATIONS, {
    items,
    pageSettings,
  });

export const updatePersonalUserNotificationAction = ({ targetId, data }) =>
  createAction(PersonalUserNotificationsActionsConstants.UPDATE_PERSONAL_USER_NOTIFICATION, {
    targetId,
    data,
  });
