import api from '@/api';
import { ReactionsConstants } from '@/constants/actions/reactions';
import { CommonVariablesConstants } from '@/constants/common/variables';
import createAction from '@/redux-actions/actionCreator';
import { extractErrorDataFromResponseApiUtil } from '@/utils/apiUtils';

const updateInProcessAction = ({ targetType, targetId, updateInProcess }) =>
  createAction(ReactionsConstants.UPDATE_IN_PROCESS, {
    updateInProcess,
    targetId,
    targetType,
  });

const updateReactionsSuccessAction = ({ targetType, targetId, data }) =>
  createAction(ReactionsConstants.UPDATE_REACTIONS, {
    targetType,
    targetId,
    data,
  });

export const getReactionsRequestAction = ({ targetType, targetId, cookie, dispatch }) =>
  new Promise((resolve, reject) => {
    dispatch(updateInProcessAction({ targetType, targetId, updateInProcess: true }));

    api
      .get(`reactions/${targetType}/${targetId}`, {
        headers: cookie
          ? {
              [CommonVariablesConstants.AUTH_TOKEN_COOKIE_NAME]: cookie,
            }
          : undefined,
      })
      .then(({ data: { data = {} } = {} }) => {
        dispatch(updateReactionsSuccessAction({ targetType, targetId, data }));

        resolve();
      })
      .catch((error) => {
        console.error(error);

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);

        dispatch(updateInProcessAction({ targetType, targetId, updateInProcess: false }));

        reject(errorData);
      });
  });

export const setReactionsRequestAction = ({ targetType, targetId, cookie, dispatch }) =>
  new Promise((resolve, reject) => {
    dispatch(updateInProcessAction({ targetType, targetId, updateInProcess: true }));

    api
      .post(`reactions/${targetType}/${targetId}`, {
        headers: cookie
          ? {
              [CommonVariablesConstants.AUTH_TOKEN_COOKIE_NAME]: cookie,
            }
          : undefined,
      })
      .then(({ data: { data = {} } = {} }) => {
        dispatch(updateReactionsSuccessAction({ targetType, targetId, data }));

        resolve();
      })
      .catch((error) => {
        console.error(error);

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);

        dispatch(updateInProcessAction({ targetType, targetId, updateInProcess: false }));

        reject(errorData);
      });
  });
