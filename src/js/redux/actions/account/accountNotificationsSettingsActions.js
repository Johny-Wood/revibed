import qs from 'qs';

import api from '@/api';
import { NotificationsSettingsActionsConstants } from '@/constants/actions/notificationsSettings';
import { CommonVariablesConstants } from '@/constants/common/variables';
import { extractErrorDataFromResponseApiUtil } from '@/utils/apiUtils';

import createAction from '../actionCreator';

const getAccountNotificationsSettingsInProcessAction = ({ targetType, getAccountNotificationsSettingsInProcess }) =>
  createAction(`${targetType}_${NotificationsSettingsActionsConstants.GET_ACCOUNT_NOTIFICATIONS_SETTINGS_IN_PROCESS}`, {
    targetType,
    getAccountNotificationsSettingsInProcess,
  });

const getAccountNotificationsSettingsSuccessAction = ({ targetType, accountNotificationsSettings }) =>
  createAction(`${targetType}_${NotificationsSettingsActionsConstants.GET_ACCOUNT_NOTIFICATIONS_SETTINGS_SUCCESS}`, {
    targetType,
    accountNotificationsSettings,
  });

export const getAccountNotificationsSettingsRequestAction = ({ targetType, token, cookie, dispatch }) =>
  new Promise((resolve, reject) => {
    dispatch(
      getAccountNotificationsSettingsInProcessAction({
        targetType,
        getAccountNotificationsSettingsInProcess: true,
      })
    );

    api
      .get('external-notifications', {
        params: {
          targetType,
          token,
        },
        headers: cookie
          ? {
              [CommonVariablesConstants.AUTH_TOKEN_COOKIE_NAME]: cookie,
            }
          : undefined,
        paramsSerializer(params) {
          return qs.stringify(params, { arrayFormat: 'repeat' });
        },
      })
      .then(({ data: { data: accountNotificationsSettings = {} } = {} }) => {
        dispatch(
          getAccountNotificationsSettingsSuccessAction({
            targetType,
            accountNotificationsSettings,
          })
        );

        resolve();
      })
      .catch((error) => {
        console.error(error);

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);
        dispatch(
          getAccountNotificationsSettingsInProcessAction({
            targetType,
            getAccountNotificationsSettingsInProcess: false,
          })
        );

        reject(errorData);
      });
  });

const saveAccountNotificationsSettingsInProcessAction = ({ targetType, saveAccountNotificationsSettingsInProcess }) =>
  createAction(`${targetType}_${NotificationsSettingsActionsConstants.SAVE_ACCOUNT_NOTIFICATIONS_SETTINGS_IN_PROCESS}`, {
    targetType,
    saveAccountNotificationsSettingsInProcess,
  });

const saveAccountNotificationsSettingsSuccessAction = ({ targetType }) =>
  createAction(`${targetType}_${NotificationsSettingsActionsConstants.SAVE_ACCOUNT_NOTIFICATIONS_SETTINGS_SUCCESS}`, {
    targetType,
  });

const changeAccountNotificationsSettingsAction = ({ targetType, accountNotificationsSettings }) =>
  createAction(`${targetType}_${NotificationsSettingsActionsConstants.CHANGE_ACCOUNT_NOTIFICATIONS_SETTINGS}`, {
    targetType,
    accountNotificationsSettings,
  });

export const saveAccountNotificationsSettingsRequestAction = ({
  targetType,
  accountNotificationsSettings,
  accountNotificationsSettingsChanged,
  token,
  template,
  dispatch,
}) =>
  new Promise((resolve, reject) => {
    dispatch(
      saveAccountNotificationsSettingsInProcessAction({
        targetType,
        saveAccountNotificationsSettingsInProcess: true,
      })
    );

    api
      .post('external-notifications/settings', accountNotificationsSettingsChanged, {
        params: {
          token,
          template,
        },
      })
      .then(() => {
        dispatch(saveAccountNotificationsSettingsSuccessAction({ targetType }));
        dispatch(
          changeAccountNotificationsSettingsAction({
            targetType,
            accountNotificationsSettings,
          })
        );

        resolve();
      })
      .catch((error) => {
        console.error(error);

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);
        dispatch(
          saveAccountNotificationsSettingsInProcessAction({
            targetType,
            saveAccountNotificationsSettingsInProcess: false,
          })
        );

        reject(errorData);
      });
  });
