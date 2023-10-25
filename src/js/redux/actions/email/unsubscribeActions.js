import qs from 'qs';

import api from '@/api';
import { UnsubscribeActionsConstants } from '@/constants/actions/unsubscribe';
import { extractErrorDataFromResponseApiUtil } from '@/utils/apiUtils';

import createAction from '../actionCreator';

const getUnsubscribeTypeInProcessAction = (getUnsubscribeTypeInProcess) =>
  createAction(UnsubscribeActionsConstants.GET_UNSUBSCRIBE_TYPE_IN_PROCESS, {
    getUnsubscribeTypeInProcess,
  });

const getUnsubscribeTypeSuccessAction = (unsubscribeType) =>
  createAction(UnsubscribeActionsConstants.GET_UNSUBSCRIBE_TYPE_SUCCESS, {
    unsubscribeType,
  });

export const changeUnsubscribeTypeAction = (unsubscribeType) =>
  createAction(UnsubscribeActionsConstants.CHANGE_UNSUBSCRIBE_TYPE, {
    unsubscribeType,
  });

export const getUnsubscribeTypeRequestAction = (token) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getUnsubscribeTypeInProcessAction(true));

    api
      .get('unsubscribe', {
        params: {
          token,
        },
        paramsSerializer(params) {
          return qs.stringify(params, { arrayFormat: 'repeat' });
        },
      })
      .then(({ data: { data: { type: unsubscribeType } = {} } = {} }) => {
        dispatch(getUnsubscribeTypeSuccessAction(unsubscribeType));

        resolve({ unsubscribeType });
      })
      .catch((error) => {
        console.error(error);

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);
        dispatch(getUnsubscribeTypeInProcessAction(false));

        reject(errorData);
      });
  });

const unsubscribeInProcessAction = (unsubscribeInProcess) =>
  createAction(UnsubscribeActionsConstants.UNSUBSCRIBE_IN_PROCESS, {
    unsubscribeInProcess,
  });

export const unsubscribeRequestAction = (params) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(unsubscribeInProcessAction(true));

    api
      .put('unsubscribe', params)
      .then(() => {
        dispatch(unsubscribeInProcessAction(false));
        resolve();
      })
      .catch((error) => {
        console.error(error);

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);
        dispatch(unsubscribeInProcessAction(false));

        reject(errorData);
      });
  });
