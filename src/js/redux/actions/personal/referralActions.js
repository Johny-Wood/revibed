import qs from 'qs';

import api from '@/api';
import { ReferralActionsConstants } from '@/constants/actions/personal/referral';
import ReduxStoreService from '@/services/ReduxStoreService';
import { extractErrorDataFromResponseApiUtil } from '@/utils/apiUtils';

import createAction from '../actionCreator';

const getReferralHistoryInProcessAction = (getReferralHistoryInProcess) =>
  createAction(ReferralActionsConstants.GET_REFERRAL_HISTORY_IN_PROCESS, {
    getReferralHistoryInProcess,
  });

const getReferralHistorySuccessAction = ({ referralHistory, referralHistoryPageSettings }) =>
  createAction(ReferralActionsConstants.GET_REFERRAL_HISTORY_SUCCESS, {
    referralHistory,
    referralHistoryPageSettings,
  });

export const getReferralRequestAction = ({ pageSize, pageNumber, dispatch }) =>
  new Promise((resolve, reject) => {
    const { store } = ReduxStoreService.getInstance();

    const { withdrawHistoryPageSettings: { page: { currentNumber: page, size } = {} } = {} } = store.getState().WithdrawReducer;

    dispatch(getReferralHistoryInProcessAction(true));

    api
      .get('personal/referrals', {
        params: {
          size: pageSize || size,
          page: pageNumber || pageNumber === 0 ? pageNumber : page,
        },
        paramsSerializer(params) {
          return qs.stringify(params, { arrayFormat: 'repeat' });
        },
      })
      .then(({ data: { data: referralHistory, payload: referralHistoryPageSettings } = {} }) => {
        dispatch(
          getReferralHistorySuccessAction({
            referralHistory,
            referralHistoryPageSettings,
          })
        );

        resolve();
      })
      .catch((error) => {
        console.error(error);

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);

        dispatch(getReferralHistoryInProcessAction(false));

        reject(errorData);
      });
  });
