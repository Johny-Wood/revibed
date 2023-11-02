import api from '@/api';
import { TrendingActionsConstants } from '@/constants/actions/trending';
import { CommonVariablesConstants } from '@/constants/common/variables';
import { extractErrorDataFromResponseApiUtil } from '@/utils/apiUtils';
import { subscribeProjectUtil } from '@/utils/project/projectsWebsocketUtil';

import createAction from '../actionCreator';

const getTrendingListInProcessAction = (getTrendingListInProcess) =>
  createAction(TrendingActionsConstants.GET_TRENDING_LIST_IN_PROCESS, {
    getTrendingListInProcess,
  });

const getTrendingListSuccessAction = ({ projectsInfo, trendingInfo, pageSettings, setProjectPosition, savePageSettings }) =>
  createAction(TrendingActionsConstants.GET_TRENDING_LIST_SUCCESS, {
    projectsInfo,
    trendingInfo,
    pageSettings,
    setProjectPosition,
    savePageSettings,
  });

export const getTrendingListRequestAction = ({ cookie, dispatch, setProjectPosition, savePageSettings }) =>
  new Promise((resolve, reject) => {
    dispatch(getTrendingListInProcessAction(true));

    api
      .get('projects/trending', {
        params: {
          size: 10,
        },
        headers: cookie
          ? {
              [CommonVariablesConstants.AUTH_TOKEN_COOKIE_NAME]: cookie,
            }
          : undefined,
      })
      .then(
        ({ data: { data: projectsInfo = [], payload: { trending: trendingInfo, page: pageSettings = {} } = {} } = {} } = {}) => {
          dispatch(
            getTrendingListSuccessAction({
              projectsInfo,
              trendingInfo,
              pageSettings,
              setProjectPosition,
              savePageSettings,
            })
          );

          projectsInfo.forEach(({ id: projectId, status }) => {
            subscribeProjectUtil({ projectId, status });
          });

          resolve();
        }
      )
      .catch((error) => {
        console.error(error);

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);
        dispatch(getTrendingListInProcessAction(false));

        reject(errorData);
      });
  });
