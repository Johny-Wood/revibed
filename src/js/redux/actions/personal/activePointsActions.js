import qs from 'qs';

import api from '@/api';
import { PersonalActionsConstants } from '@/constants/actions/personal/personal';
import { CommonVariablesConstants } from '@/constants/common/variables';
import { PointsActivePointsReducersMapConstants } from '@/constants/points/activePointsReducersMap';
import ReduxStoreService from '@/services/ReduxStoreService';
import { extractErrorDataFromResponseApiUtil } from '@/utils/apiUtils';

import createAction from '../actionCreator';

const loadPersonalActivePointsInProcessAction = ({ type, loadPersonalActivePointsInProcess }) =>
  createAction(`${type}_${PersonalActionsConstants.LOAD_PERSONAL_ACTIVE_POINTS_IN_PROCESS}`, {
    loadPersonalActivePointsInProcess,
  });

const loadPersonalActivePointsSuccessAction = ({ type, personalActivePoints, pageSettings }) =>
  createAction(`${type}_${PersonalActionsConstants.LOAD_PERSONAL_ACTIVE_POINTS_SUCCESS}`, {
    personalActivePoints,
    pageSettings,
  });

export const addPersonalActivePointsAction = ({ type, personalActivePoints }) =>
  createAction(`${type}_${PersonalActionsConstants.ADD_PERSONAL_ACTIVE_POINTS}`, {
    personalActivePoints,
  });

export const loadPersonalActivePointsRequestAction = ({ type, pageSize, pageNumber, cookie, dispatch }) =>
  new Promise((resolve, reject) => {
    const { store } = ReduxStoreService.getInstance();

    const { pageSettings: { page: { size, page } = {} } = {} } =
      store.getState()[PointsActivePointsReducersMapConstants[type]] || {};

    dispatch(loadPersonalActivePointsInProcessAction({ type, loadPersonalActivePointsInProcess: true }));

    api
      .get('personal/points', {
        headers: cookie
          ? {
              [CommonVariablesConstants.AUTH_TOKEN_COOKIE_NAME]: cookie,
            }
          : undefined,
        params: {
          type,
          size: pageSize || size,
          page: pageNumber || pageNumber === 0 ? pageNumber : page,
        },
        paramsSerializer(params) {
          return qs.stringify(params, { arrayFormat: 'repeat' });
        },
      })
      .then(({ data: { data: personalActivePoints = [], payload: pageSettings = {} } = {} }) => {
        dispatch(loadPersonalActivePointsSuccessAction({ type, personalActivePoints, pageSettings }));
        resolve();
      })
      .catch((error) => {
        console.error(error);

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);

        dispatch(
          loadPersonalActivePointsInProcessAction({
            type,
            loadPersonalActivePointsInProcess: false,
          })
        );
        reject(errorData);
      });
  });
