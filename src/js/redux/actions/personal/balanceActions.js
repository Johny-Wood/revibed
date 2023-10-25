import qs from 'qs';

import api from '@/api';
import { PersonalActionsConstants } from '@/constants/actions/personal/personal';
import ReduxStoreService from '@/services/ReduxStoreService';
import { extractErrorDataFromResponseApiUtil } from '@/utils/apiUtils';

import createAction from '../actionCreator';

const PERSONAL_API_URL = 'personal';

const loadPersonalBalanceInProcessAction = (loadPersonalBalanceInProcess) =>
  createAction(PersonalActionsConstants.LOAD_PERSONAL_BALANCE_IN_PROCESS, {
    loadPersonalBalanceInProcess,
  });

const loadPersonalBalanceSuccessAction = (personalBalanceList, personalBalanceListSettings) =>
  createAction(PersonalActionsConstants.LOAD_PERSONAL_BALANCE_SUCCESS, {
    personalBalanceList,
    personalBalanceListSettings,
  });

export const loadPersonalBalanceRequestAction = ({ pageNumber, pageSize, dispatch }) =>
  new Promise((resolve, reject) => {
    const { store } = ReduxStoreService.getInstance();

    dispatch(loadPersonalBalanceInProcessAction(true));

    const { size, page, sortQuery = [] } = store.getState().BalanceReducer;

    let sortQueryNew = {};

    Object.keys(sortQuery).forEach((sortKey) => {
      const sortSelectedItem = sortQuery[sortKey];
      const { value: queryParam } = sortSelectedItem;

      sortQueryNew = {
        ...sortQueryNew,
        sort: sortQuery.sort ? [...sortQueryNew.sort, `${sortKey},${queryParam}`] : [`${sortKey},${queryParam}`],
      };
    });

    api
      .get(`${PERSONAL_API_URL}/balance`, {
        params: {
          size: pageSize || size,
          page: page || page === 0 ? page : pageNumber,
          ...sortQueryNew,
        },
        paramsSerializer(params) {
          return qs.stringify(params, { arrayFormat: 'repeat' });
        },
      })
      .then(({ data: { data: responseData = {}, payload: payloadData = {} } = {} }) => {
        dispatch(loadPersonalBalanceSuccessAction(responseData, payloadData));

        resolve();
      })
      .catch((error) => {
        console.error(error);

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);

        dispatch(loadPersonalBalanceInProcessAction(false));

        reject(errorData);
      });
  });

export const personalBalanceSortSelectedAction = (sortQuery) => (dispatch) => {
  dispatch({
    type: PersonalActionsConstants.PERSONAL_BALANCE_SORT_SELECT,
    payload: {
      sortQuery,
    },
  });
};

export const resetLoadPersonalBalanceFromApiAction = () => (dispatch) => {
  dispatch({
    type: PersonalActionsConstants.RESET_LOAD_PERSONAL_BALANCE_FROM_API,
  });
};

const loadPersonalTopUpBalanceInProcessAction = (loadPersonalTopUpBalanceInProcess) => (dispatch) => {
  dispatch({
    type: PersonalActionsConstants.LOAD_PERSONAL_TOP_UP_BALANCE_IN_PROCESS,
    payload: {
      loadPersonalTopUpBalanceInProcess,
    },
  });
};

const loadPersonalTopUpBalanceSuccessAction = (loadPersonalTopUpBalanceList) => (dispatch) => {
  dispatch({
    type: PersonalActionsConstants.LOAD_PERSONAL_TOP_UP_BALANCE_SUCCESS,
    payload: {
      loadPersonalTopUpBalanceList,
    },
  });
};

export const loadPersonalTopUpBalanceRequestAction = ({ dispatch }) =>
  new Promise((resolve, reject) => {
    dispatch(loadPersonalTopUpBalanceInProcessAction(true));

    api
      .get('/coins-packs')
      .then(({ data: { data: responseData = {} } = {} }) => {
        dispatch(loadPersonalTopUpBalanceSuccessAction(responseData));

        resolve();
      })
      .catch((error) => {
        console.error(error);

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);

        dispatch(loadPersonalTopUpBalanceInProcessAction(false));

        reject(errorData);
      });
  });

const personalTopUpBalanceInProcessAction = (personalTopUpBalanceInProcess) =>
  createAction(PersonalActionsConstants.PERSONAL_TOP_UP_BALANCE_IN_PROCESS, {
    personalTopUpBalanceInProcess,
  });

const personalTopUpBalanceSuccessAction = () => createAction(PersonalActionsConstants.PERSONAL_TOP_UP_BALANCE_SUCCESS);

export const personalTopUpBalanceRequestAction =
  ({ packId, paymentSystem }) =>
  (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(personalTopUpBalanceInProcessAction(true));

      api
        .put(`${PERSONAL_API_URL}/balance`, {
          paymentSystem,
          packId,
        })
        .then(({ data: { data: { redirectUrl } = {} } = {} }) => {
          dispatch(personalTopUpBalanceSuccessAction());

          resolve(redirectUrl);
        })
        .catch((error) => {
          console.error(error);

          const { data: errorData } = extractErrorDataFromResponseApiUtil(error);

          dispatch(personalTopUpBalanceInProcessAction(false));

          reject(errorData);
        });
    });
