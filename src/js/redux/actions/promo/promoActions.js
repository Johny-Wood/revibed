import axios from 'axios';
import qs from 'qs';

import api from '@/api';
import { PromoActionsConstants } from '@/constants/actions/promo';
import { CommonVariablesConstants } from '@/constants/common/variables';
import ReduxStoreService from '@/services/ReduxStoreService';
import { extractErrorDataFromResponseApiUtil } from '@/utils/apiUtils';

import createAction from '../actionCreator';

const loadPromoListSuccessAction = (promoActions) =>
  createAction(PromoActionsConstants.LOAD_PROMO_LIST_SUCCESS, {
    promoActions,
  });

export const loadPromoListRequestAction = ({ cookie, dispatch }) =>
  new Promise((resolve, reject) => {
    api
      .get('promo-actions', {
        headers: cookie
          ? {
              [CommonVariablesConstants.AUTH_TOKEN_COOKIE_NAME]: cookie,
            }
          : undefined,
      })
      .then(({ data: { data } = {} } = {}) => {
        dispatch(loadPromoListSuccessAction(data));
        resolve();
      })
      .catch((error) => {
        console.error(error);

        reject();
      });
  });

const makePromoCodeInProcessAction = (makePromoCodeInProcess) =>
  createAction(PromoActionsConstants.MAKE_PROMO_CODE_IN_PROCESS, {
    makePromoCodeInProcess,
  });

const makePromoCodeSuccessAction = ({ promoName, data }) =>
  createAction(PromoActionsConstants.MAKE_PROMO_CODE_SUCCESS, {
    promoName,
    data,
  });

export const makePromoCodeRequestAction = ({ promoName, dispatch }) =>
  new Promise((resolve, reject) => {
    dispatch(makePromoCodeInProcessAction(true));

    const { store = {} } = ReduxStoreService.getInstance();
    const { PromoReducer: { promoActions = {} } = {} } = store.getState();

    const { id: promoId } = promoActions[promoName];

    api
      .put(`promo-actions/${promoId}/codes`)
      .then(({ data: { data: { code } = {} } = {} } = {}) => {
        dispatch(
          makePromoCodeSuccessAction({
            promoName,
            data: {
              lastOutCode: {
                code,
              },
            },
          })
        );

        resolve();
      })
      .catch(() => {
        dispatch(makePromoCodeInProcessAction(false));

        reject();
      });
  });

const getPromoCodeInfoInProcessAction = (getPromoCodeInfoInProcess) =>
  createAction(PromoActionsConstants.GET_PROMO_CODE_INFO_IN_PROCESS, {
    getPromoCodeInfoInProcess,
  });

const getPromoCodeInfoSuccessAction = () => createAction(PromoActionsConstants.GET_PROMO_CODE_INFO_SUCCESS);

let cancelTokenGetPromoCodeInfoRequest;
export const getPromoCodeInfoRequestAction = ({ scope, code, dispatch }) =>
  new Promise((resolve, reject) => {
    if (cancelTokenGetPromoCodeInfoRequest) {
      cancelTokenGetPromoCodeInfoRequest.cancel();
    }

    cancelTokenGetPromoCodeInfoRequest = axios.CancelToken.source();

    dispatch(getPromoCodeInfoInProcessAction(true));

    api
      .get('promo-actions/codes', {
        cancelToken: cancelTokenGetPromoCodeInfoRequest.token,
        params: { code, scope },
        paramsSerializer(params) {
          return qs.stringify(params, { arrayFormat: 'repeat' });
        },
      })
      .then(({ data: { data: promoCodeInfo = {} } = {} } = {}) => {
        dispatch(getPromoCodeInfoSuccessAction());

        resolve({ promoCodeInfo });
      })
      .catch((error) => {
        console.error(error);

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);

        dispatch(getPromoCodeInfoInProcessAction(axios.isCancel(error)));

        reject(errorData);
      });
  });
