import api from '@/api';
import { PersonalActionsConstants } from '@/constants/actions/personal/personal';
import { CommonVariablesConstants } from '@/constants/common/variables';
import { extractErrorDataFromResponseApiUtil } from '@/utils/apiUtils';

import createAction from '../actionCreator';

const PERSONAL_API_URL = 'personal';

const loadPersonalProjectsStatsInProcessAction = (loadPersonalProjectsStatsInProcess) =>
  createAction(PersonalActionsConstants.LOAD_PERSONAL_PROJECTS_STATS_IN_PROCESS, {
    loadPersonalProjectsStatsInProcess,
  });

const loadPersonalProjectsStatsSuccessAction = (personalProjectsStats) =>
  createAction(PersonalActionsConstants.LOAD_PERSONAL_PROJECTS_STATS_SUCCESS, {
    personalProjectsStats,
  });

export const loadPersonalProjectsStatsRequestAction = (cookie) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(loadPersonalProjectsStatsInProcessAction(true));

    api
      .get(`${PERSONAL_API_URL}/projects-stats`, {
        headers: cookie
          ? {
              [CommonVariablesConstants.AUTH_TOKEN_COOKIE_NAME]: cookie,
            }
          : undefined,
      })
      .then(({ data: { data: responseData = {} } = {} }) => {
        dispatch(loadPersonalProjectsStatsSuccessAction(responseData));

        resolve();
      })
      .catch((error) => {
        console.error(error);

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);

        dispatch(loadPersonalProjectsStatsInProcessAction(false));

        reject(errorData);
      });
  });

export const resetLoadPersonalProjectsStatsFromApiAction = () => (dispatch) => {
  dispatch({
    type: PersonalActionsConstants.RESET_LOAD_PERSONAL_PROJECTS_STATS_FROM_API,
  });
};
