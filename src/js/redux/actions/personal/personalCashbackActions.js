import api from '@/api';
import { PersonalCashbackActionsConstants } from '@/constants/actions/personal/personalCashback';
import { CommonVariablesConstants } from '@/constants/common/variables';
import { extractErrorDataFromResponseApiUtil } from '@/utils/apiUtils';

import createAction from '../actionCreator';

const getPersonalCashbackInProcessAction = ({ getPersonalCashbackInProcess }) =>
  createAction(PersonalCashbackActionsConstants.GET_PERSONAL_CASHBACK_IN_PROCESS, {
    getPersonalCashbackInProcess,
  });

const getPersonalCashbackSuccessAction = ({ personalCashback }) =>
  createAction(PersonalCashbackActionsConstants.GET_PERSONAL_CASHBACK_SUCCESS, {
    personalCashback,
  });

export const getPersonalCashbackRequestAction = ({ cookie, dispatch }) =>
  new Promise((resolve, reject) => {
    dispatch(getPersonalCashbackInProcessAction({ getPersonalCashbackInProcess: true }));

    api
      .get('personal/balance/cashback', {
        headers: cookie
          ? {
              [CommonVariablesConstants.AUTH_TOKEN_COOKIE_NAME]: cookie,
            }
          : undefined,
      })
      .then(({ data: { data: responseData = {} } = {} }) => {
        dispatch(getPersonalCashbackSuccessAction({ personalCashback: responseData }));

        resolve();
      })
      .catch((error) => {
        console.error(error);

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);

        dispatch(getPersonalCashbackInProcessAction({ getPersonalCashbackInProcess: false }));

        reject(errorData);
      });
  });
