import axios from 'axios';

import api from '@/api';
import { GoodsCollectionsActionsConstants } from '@/constants/actions/collections/collections';
import { extractErrorDataFromResponseApiUtil } from '@/utils/apiUtils';

import createAction from '../actionCreator';

const getGoodsCollectionsListInProcessAction = ({ getGoodsCollectionsListInProcess }) =>
  createAction(`${GoodsCollectionsActionsConstants.GET_COLLECTIONS_IN_PROCESS}`, {
    getGoodsCollectionsListInProcess,
  });

const getGoodsCollectionsListSuccessAction = ({ goodsCollectionsList, pageSettings }) =>
  createAction(`${GoodsCollectionsActionsConstants.GET_COLLECTIONS_SUCCESS}`, {
    goodsCollectionsList,
    pageSettings,
  });

let getGoodsCollectionsListRequestActionCancelToken;

export const getGoodsCollectionsListRequestAction = ({
  withCancel = true,
  withInProcess = true,
  useCustomResponseHandler = false,
  dispatch,
}) =>
  new Promise((resolve) => {
    if (withCancel) {
      if (getGoodsCollectionsListRequestActionCancelToken) {
        getGoodsCollectionsListRequestActionCancelToken.cancel();
      }

      getGoodsCollectionsListRequestActionCancelToken = axios.CancelToken.source();
    }

    if (withInProcess) {
      dispatch(
        getGoodsCollectionsListInProcessAction({
          getGoodsCollectionsListInProcess: true,
        })
      );
    }

    api
      .get('collections', {})
      .then(({ data: { data: goodsCollectionsList = [], payload, payload: { page: pageSettings = {} } = {} } = {} }) => {
        if (useCustomResponseHandler) {
          resolve({
            responseData: goodsCollectionsList,
            payload,
          });
          return;
        }

        dispatch(
          getGoodsCollectionsListSuccessAction({
            goodsCollectionsList,
            pageSettings,
          })
        );
        resolve({
          length: goodsCollectionsList.length,
        });
      })
      .catch((error) => {
        console.error(error);

        dispatch(
          getGoodsCollectionsListInProcessAction({
            getCollectionsListInProcess: axios.isCancel(error),
          })
        );

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);

        resolve(errorData);
      });
  });
