import qs from 'qs';

import api from '@/api';
import { ProjectBalanceActionsConstants } from '@/constants/actions/projects/projectBalance';
import ReduxStoreService from '@/services/ReduxStoreService';

import createAction from '../actionCreator';

const loadProjectBalanceInProcessAction = (loadProjectBalanceInProcess) =>
  createAction(ProjectBalanceActionsConstants.LOAD_PROJECT_BALANCE_IN_PROCESS, {
    loadProjectBalanceInProcess,
  });

const loadProjectBalanceSuccessAction = ({ projectBalance, projectBalancePageSettings }) =>
  createAction(ProjectBalanceActionsConstants.LOAD_PROJECT_BALANCE_SUCCESS, {
    projectBalance,
    projectBalancePageSettings,
  });

export const loadProjectBalanceRequestAction =
  ({ projectId, pageSize, pageNumber }) =>
  (dispatch) =>
    new Promise((resolve) => {
      dispatch(loadProjectBalanceInProcessAction(true));

      const { store } = ReduxStoreService.getInstance();

      const { projectBalancePageSettings: { currentNumber: page, size } = {} } = store.getState().ProjectBalanceReducer;

      api
        .get(`projects/${projectId}/balance`, {
          params: {
            size: pageSize || size,
            page: pageNumber || pageNumber === 0 ? pageNumber : page,
          },
          paramsSerializer(params) {
            return qs.stringify(params, { arrayFormat: 'repeat' });
          },
        })
        .then(({ data: { data: projectBalance = {}, payload: { page: projectBalancePageSettings = {} } = {} } = {} }) => {
          dispatch(
            loadProjectBalanceSuccessAction({
              projectBalance,
              projectBalancePageSettings,
            })
          );

          resolve({});
        })
        .catch(() => {
          dispatch(loadProjectBalanceInProcessAction(false));

          resolve();
        });
    });
