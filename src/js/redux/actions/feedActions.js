import qs from 'qs';

import api from '@/api';
import { ProjectsActionsConstants } from '@/constants/actions/projects/projects';
import { CommonVariablesConstants } from '@/constants/common/variables';
import { ProjectsLocationsConstants } from '@/constants/projects/location';
import ReduxStoreService from '@/services/ReduxStoreService';

import createAction from './actionCreator';

export const updateFeedListPageAction = ({ location, items, pageSettings }) =>
  createAction(`${location}_${ProjectsActionsConstants.PROJECTS_UPDATE_LIST_PAGE}`, {
    items,
    pageSettings,
  });

const getFeedInProcessAction = ({ location, getProjectsInProcess }) =>
  createAction(`${location}_${ProjectsActionsConstants.GET_PROJECTS_IN_PROCESS}`, {
    getProjectsInProcess,
  });

const getFeedSuccessAction = ({ location, ...data }) =>
  createAction(`${location}_${ProjectsActionsConstants.GET_PROJECTS_SUCCESS}`, {
    ...data,
  });

export const getFeedRequestAction = ({
  infinityScroll,
  withInProcess = true,
  useCustomResponseHandler,
  withoutSave,
  pageNumber,
  pageSize = 24,
  setProjectPosition,
  savePageSettings,
  cookie,
  dispatch,
}) =>
  new Promise((resolve, reject) => {
    const location = ProjectsLocationsConstants.MY_FEED;

    if (withInProcess) {
      dispatch(getFeedInProcessAction({ location, getProjectsInProcess: true }));
    }

    const { store } = ReduxStoreService.getInstance();

    const { pageSettings: { currentNumber } = {} } = store.getState().MyFeedReducer || {};

    api
      .get('feed', {
        headers: cookie
          ? {
              [CommonVariablesConstants.AUTH_TOKEN_COOKIE_NAME]: cookie,
            }
          : undefined,
        params: {
          size: pageSize,
          page: pageNumber || pageNumber === 0 ? pageNumber : currentNumber,
        },
        paramsSerializer(params) {
          return qs.stringify(params, { arrayFormat: 'repeat' });
        },
      })
      .then(({ data: { data: projects, payload, payload: { page: pageSettings } = {} } = {} }) => {
        if (useCustomResponseHandler) {
          resolve({ responseData: projects, payload });
          return;
        }

        dispatch(
          getFeedSuccessAction({
            location,
            withoutSave,
            projects,
            pageSettings,
            setProjectPosition,
            infinityScroll,
            savePageSettings,
          })
        );

        resolve({ list: projects, pageSettings });
      })
      .catch(() => {
        dispatch(getFeedInProcessAction({ location, getProjectsInProcess: false }));

        reject();
      });
  });
