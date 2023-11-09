import axios from 'axios';

import api from '@/api';
import { CollectionsActionsConstants } from '@/constants/actions/collections/collections';
import { extractErrorDataFromResponseApiUtil } from '@/utils/apiUtils';

import createAction from '../actionCreator';

const getCollectionsListInProcessAction = ({ getCollectionsListInProcess }) =>
  createAction(`${CollectionsActionsConstants.GET_COLLECTIONS_IN_PROCESS}`, {
    getCollectionsListInProcess,
  });

const getCollectionsListSuccessAction = ({ collectionsList, pageSettings }) =>
  createAction(`${CollectionsActionsConstants.GET_COLLECTIONS_SUCCESS}`, {
    collectionsList,
    pageSettings,
  });

let getCollectionsListRequestActionCancelToken;

export const getCollectionsListRequestAction = ({
  withCancel = true,
  withInProcess = true,
  useCustomResponseHandler = false,
  dispatch,
}) =>
  new Promise((resolve) => {
    if (withCancel) {
      if (getCollectionsListRequestActionCancelToken) {
        getCollectionsListRequestActionCancelToken.cancel();
      }

      getCollectionsListRequestActionCancelToken = axios.CancelToken.source();
    }

    if (withInProcess) {
      dispatch(
        getCollectionsListInProcessAction({
          getCollectionsListInProcess: true,
        })
      );
    }

    api
      .get('collections', {})
      .then(({ data: { data: collectionsList = [], payload, payload: { page: pageSettings = {} } = {} } = {} }) => {
        if (useCustomResponseHandler) {
          resolve({
            responseData: collectionsList,
            payload,
          });
          return;
        }

        dispatch(
          getCollectionsListSuccessAction({
            collectionsList,
            pageSettings,
          })
        );
        resolve({
          length: collectionsList.length,
        });
      })
      .catch((error) => {
        console.error(error);

        dispatch(
          getCollectionsListInProcessAction({
            getCollectionsListInProcess: axios.isCancel(error),
          })
        );

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);

        resolve(errorData);
      });
  });
