import qs from 'qs';

import api from '@/api';
import { PurchasesActionsConstants } from '@/constants/actions/personal/purchases';
import { CommonVariablesConstants } from '@/constants/common/variables';
import ProcessService from '@/services/ProcessService';
import ReduxStoreService from '@/services/ReduxStoreService';
import { extractErrorDataFromResponseApiUtil } from '@/utils/apiUtils';

import createAction from '../actionCreator';

export const updatePurchasesAction = ({ items, pageSettings }) =>
  createAction(PurchasesActionsConstants.UPDATE_PURCHASES_REQUESTS, {
    list: items,
    pageSettings,
  });

const getPurchasesInProcessAction = (getPurchasesInProcess) =>
  createAction(PurchasesActionsConstants.GET_PURCHASES_IN_PROCESS, {
    getPurchasesInProcess,
  });

const getPurchasesSuccessAction = ({ list, pageSettings, position }) =>
  createAction(PurchasesActionsConstants.GET_PURCHASES_SUCCESS, {
    list,
    pageSettings,
    position,
  });

export const getPurchasesRequestAction = ({ withInProcess = true, position, pageSize, pageNumber, cookie, dispatch }) =>
  new Promise((resolve) => {
    const { store } = ReduxStoreService.getInstance();

    const { pageSettings: { currentNumber: page, size } = {} } = store.getState().PurchasesReducer;

    if (withInProcess) {
      dispatch(getPurchasesInProcessAction(true));
    }

    api
      .get('personal/orders', {
        params: {
          size: pageSize || size,
          page: pageNumber || pageNumber === 0 ? pageNumber : page,
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
      .then(({ data: { data: list, payload: { page: pageSettings } } = {} }) => {
        dispatch(
          getPurchasesSuccessAction({
            list,
            pageSettings,
            position,
          })
        );

        resolve();
      })
      .catch((error) => {
        console.error(error);

        dispatch(getPurchasesInProcessAction(false));

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);
        resolve(errorData);
      });
  });

const getPurchaseInProcessAction = (getPurchaseInProcess) =>
  createAction(PurchasesActionsConstants.GET_PURCHASE_IN_PROCESS, {
    getPurchaseInProcess,
  });

const getPurchaseSuccessAction = ({ card, id }) =>
  createAction(PurchasesActionsConstants.GET_PURCHASE_SUCCESS, {
    card,
    id,
  });

export const getPurchaseRequestAction = ({ id, cookie, dispatch }) =>
  new Promise((resolve) => {
    dispatch(getPurchaseInProcessAction(true));

    api
      .get(`personal/orders/${id}`, {
        headers: cookie
          ? {
              [CommonVariablesConstants.AUTH_TOKEN_COOKIE_NAME]: cookie,
            }
          : undefined,
        paramsSerializer(params) {
          return qs.stringify(params, { arrayFormat: 'repeat' });
        },
      })
      .then(({ data: { data: card } = {} }) => {
        dispatch(
          getPurchaseSuccessAction({
            card,
            id,
          })
        );

        resolve();
      })
      .catch((error) => {
        console.error(error);

        dispatch(getPurchaseInProcessAction(false));

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);
        resolve(errorData);
      });
  });

const downloadPurchasesInProcessAction = (downloadPurchasesInProcessId, isEnd) =>
  createAction(PurchasesActionsConstants.DOWNLOAD_PURCHASES_IN_PROCESS, {
    downloadPurchasesInProcessId,
    isEnd,
  });

export const downloadPurchasesRequestAction = ({ targetType, targetId, dispatch }) =>
  new Promise((resolve, reject) => {
    dispatch(downloadPurchasesInProcessAction(targetId));

    api
      .get(`personal/purchases/download?targetType=${targetType}&targetId=${targetId}`, {
        responseType: 'blob',
        onDownloadProgress: ({ loaded, total }) => {
          ProcessService.updateProcess({
            id: targetId,
            params: { progressValue: (loaded * 100) / total },
          });
        },
      })
      .then(({ data, headers }) => {
        dispatch(downloadPurchasesInProcessAction(targetId, true));

        const fileName = headers['content-disposition'].split('filename=').pop().replace(/"/gi, '');

        if (typeof window.navigator.msSaveBlob !== 'undefined') {
          window.navigator.msSaveBlob(data, fileName);
        } else {
          const url = URL.createObjectURL(data);
          const link = document.createElement('a');

          link.download = fileName;
          link.href = url;
          link.click();

          setTimeout(() => {
            window.URL.revokeObjectURL(data);
            link.remove();
          }, 100);
        }

        resolve();
      })
      .catch((error) => {
        console.error(error);

        dispatch(downloadPurchasesInProcessAction(targetId, true));

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);
        reject(errorData);
      });
  });
