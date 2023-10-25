import qs from 'qs';

import api from '@/api';
import { RulesActionsConstants } from '@/constants/actions/common/rules';

import createAction from '../actionCreator';

const loadRulesInProcessAction = (loadRulesInProcess) =>
  createAction(RulesActionsConstants.LOAD_RULES_IN_PROCESS, {
    loadRulesInProcess,
  });

const loadRulesSuccessAction = ({ rulesContent, rulesName }) =>
  createAction(RulesActionsConstants.LOAD_RULES_SUCCESS, {
    rulesName,
    rulesContent,
  });

export const loadRulesRequestAction =
  (rulesName = '') =>
  (dispatch) =>
    new Promise((resolve) => {
      dispatch(loadRulesInProcessAction(true));

      api
        .get('static-page-content', {
          params: {
            query: rulesName,
          },
          paramsSerializer(params) {
            return qs.stringify(params, { arrayFormat: 'repeat' });
          },
        })
        .then(({ data: { data: responseData = {} } }) => {
          dispatch(loadRulesSuccessAction({ rulesName, rulesContent: responseData }));

          resolve();
        })
        .catch((error) => {
          console.error(error);

          dispatch(loadRulesInProcessAction(false));
          resolve();
        });
    });
