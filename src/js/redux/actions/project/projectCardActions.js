import axios from 'axios';
import qs from 'qs';

import api from '@/api';
import { ProjectActionsConstants } from '@/constants/actions/project/project';
import { ProjectCardActionsConstants } from '@/constants/actions/projects/projectCard';
import { ProjectsActionsConstants } from '@/constants/actions/projects/projects';
import { CommonVariablesConstants } from '@/constants/common/variables';
import { ProjectsLocationsConstants } from '@/constants/projects/location';
import { analyticsPurchasePush } from '@/utils/analytics/analyticsPushers';
import { extractErrorDataFromResponseApiUtil } from '@/utils/apiUtils';
import { updateProjectsInfoUtil } from '@/utils/project/projectsUpdateUtil';
import { subscribeProjectUtil } from '@/utils/project/projectsWebsocketUtil';

import createAction from '../actionCreator';
import { changeUserInfoAction } from '../auth/authActions';
import { resetLoadPersonalBalanceFromApiAction } from '../personal/balanceActions';
import { resetLoadPersonalProjectsStatsFromApiAction } from '../personal/projectsStatsActions';
import { projectsUpdateProjectAction, resetGetProjectsFromApiAction } from '../projects/projectsActions';

export const transformToProjectCommentsAction = ({ projectCardId, commentsInfo }) =>
  createAction(ProjectCardActionsConstants.TRANSFORM_TO_PROJECT_COMMENTS, {
    projectCardId,
    commentsInfo,
  });

export const addProjectCardDocumentAction = ({ document, projectCardId }) =>
  createAction(ProjectCardActionsConstants.ADD_PROJECT_CARD_DOCUMENT, {
    document,
    projectCardId,
  });

export const removeProjectCardDocumentAction = ({ documentId, projectCardId }) =>
  createAction(ProjectCardActionsConstants.REMOVE_PROJECT_CARD_DOCUMENT, {
    documentId,
    projectCardId,
  });

export const transformProjectCardDocumentAction = ({ documents, projectCardId }) =>
  createAction(ProjectCardActionsConstants.TRANSFORM_PROJECT_CARD_DOCUMENT, {
    documents,
    projectCardId,
  });

export const addProjectCardAdditionalExpensesAction = ({ expense, projectCardId }) =>
  createAction(ProjectCardActionsConstants.ADD_PROJECT_CARD_ADDITIONAL_EXPENSE, {
    expense,
    projectCardId,
  });

export const removeProjectCardAdditionalExpensesAction = ({ expenseId, projectCardId }) =>
  createAction(ProjectCardActionsConstants.REMOVE_PROJECT_CARD_ADDITIONAL_EXPENSE, {
    expenseId,
    projectCardId,
  });

export const transformProjectCardAdditionalExpensesAction = ({ expenses, projectCardId }) =>
  createAction(ProjectCardActionsConstants.TRANSFORM_PROJECT_CARD_ADDITIONAL_EXPENSE, {
    expenses,
    projectCardId,
  });

export const transformProjectCardRealConditions = ({ realConditions, projectCardId }) =>
  createAction(ProjectCardActionsConstants.TRANSFORM_PROJECT_CARD_REAL_CONDITIONS, {
    realConditions,
    projectCardId,
  });

export const replaceProjectCardAction = ({ project, projectCardId }) =>
  createAction(ProjectCardActionsConstants.REPLACE_PROJECT_CARD, {
    project,
    projectCardId,
  });

const getProjectCardInProcessAction = (getProjectCardInProcess) =>
  createAction(ProjectCardActionsConstants.GET_PROJECT_CARD_IN_PROCESS, {
    getProjectCardInProcess,
  });

const getProjectCardSuccessAction = (projectCard, projectCardId) =>
  createAction(ProjectCardActionsConstants.GET_PROJECT_CARD_SUCCESS, {
    projectCard,
    projectCardId,
  });

const buyCutInProcessAction = (buyCutInProcess) =>
  createAction(ProjectsActionsConstants.BUY_CUT_IN_PROCESS, {
    buyCutInProcess,
  });

const buyCutSuccessAction = (projectId, { commentsInfo, updatedProject, projectInfo }) =>
  createAction(ProjectsActionsConstants.BUY_CUT_SUCCESS, {
    projectId,
    commentsInfo,
    updatedProject,
    projectInfo,
  });

export const changeFollowUserProjectCardAction = ({ userId, isFollowing }) =>
  createAction(ProjectCardActionsConstants.PROJECT_CHANGE_FOLLOW_USER, {
    userId,
    isFollowing,
  });

export const getProjectCardRequestAction =
  ({ projectCardId, isEditRequest }, cookie) =>
  (dispatch) =>
    new Promise((resolve) => {
      dispatch(getProjectCardInProcessAction(true));

      api
        .get(`projects/${projectCardId}`, {
          params: {
            edit: isEditRequest,
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
        .then(({ data: { data: responseData = {} } = {} }) => {
          dispatch(getProjectCardSuccessAction(responseData, projectCardId));

          resolve({});
        })
        .catch((error) => {
          console.error(error);

          dispatch(getProjectCardInProcessAction(false));

          const { data: errorData } = extractErrorDataFromResponseApiUtil(error);

          resolve(errorData);
        });
    });

const resetLoadedProjectsInformationFromApi = (dispatch) => {
  dispatch(resetLoadPersonalProjectsStatsFromApiAction());
  dispatch(resetLoadPersonalBalanceFromApiAction());

  Object.keys(ProjectsLocationsConstants).forEach((location) => {
    dispatch(resetGetProjectsFromApiAction(location));
  });
};

export const deleteProjectCardFreeBonusSlotAction = ({ type, projectId, removeAll }) =>
  createAction(ProjectCardActionsConstants.PROJECT_DELETE_FREE_BONUS_SLOT, {
    type,
    projectId,
    removeAll,
  });

export const buyCutRequestAction = ({
  id,
  cutsCount,
  useGoldenCoin,
  isUseGem,
  saveProjectInfo,
  withSubscribe,
  buttonType,
  dispatch,
}) =>
  new Promise((resolve, reject) => {
    dispatch(buyCutInProcessAction(true));

    api
      .put(`projects/${id}/buy-cut`, {
        cutsCount,
        useGoldenCoin,
        useGem: isUseGem,
        buttonType,
      })
      .then(({ data: { data: responseData = {}, payload: { transactionId, updatedProject } = {} } = {} }) => {
        const {
          id: projectId,
          title: projectName,
          amount: projectPrice,
          priceCut: projectPriceCut,
          commentsInfo,
        } = updatedProject;

        if (withSubscribe) {
          subscribeProjectUtil({ projectId, subscribeNow: true });
        }

        dispatch(
          buyCutSuccessAction(id, {
            commentsInfo,
            projectInfo: updatedProject,
            updatedProject: saveProjectInfo ? updatedProject : undefined,
          })
        );
        dispatch(changeUserInfoAction(responseData));

        if (saveProjectInfo) {
          updateProjectsInfoUtil({
            projectId,
            projectInfo: updatedProject,
            updateAction: projectsUpdateProjectAction,
          });
        }

        analyticsPurchasePush({
          transactionId,
          cutPrice: +(cutsCount * projectPriceCut).toFixed(2),
          projectId,
          projectName,
          projectPrice,
        });

        resetLoadedProjectsInformationFromApi(dispatch, updatedProject);

        resolve(responseData);
      })
      .catch((error) => {
        console.error(error);

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);
        const { payload: { updatedProject } = {} } = errorData;

        if (updatedProject) {
          resetLoadedProjectsInformationFromApi(dispatch, updatedProject);
        }

        dispatch(buyCutInProcessAction(false));

        reject(errorData);
      });
  });

const getShortProjectCardInProcessAction = (getShortProjectCardInProcess) =>
  createAction(ProjectActionsConstants.GET_SHORT_PROJECT_INFO_IN_PROCESS, {
    getShortProjectCardInProcess,
  });

const getShortProjectCardSuccessAction = () => createAction(ProjectActionsConstants.GET_SHORT_PROJECT_INFO_SUCCESS);

export const getShortProjectCardRequestAction = ({ projectId, type, dispatch, cookie }) =>
  new Promise((resolve) => {
    dispatch(getShortProjectCardInProcessAction(true));

    api
      .get(`projects/${projectId}`, {
        params: {
          type,
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
      .then(({ data: { data: responseData = {} } = {} }) => {
        const { status } = responseData;
        dispatch(getShortProjectCardSuccessAction());

        subscribeProjectUtil({ projectId, status });

        resolve({ newProject: responseData });
      })
      .catch((error) => {
        console.error(error);

        dispatch(getShortProjectCardInProcessAction(false));
        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);

        resolve({ errorData });
      });
  });

const changeOrderProjectVideosInProcessAction = (changeOrderProjectVideosInProcess) =>
  createAction(ProjectActionsConstants.CHANGE_ORDER_PROJECT_VIDEO_IN_PROCESS, {
    changeOrderProjectVideosInProcess,
  });

const changeOrderProjectVideosSuccessAction = ({ projectCardId, youtubeLinks }) =>
  createAction(ProjectActionsConstants.CHANGE_ORDER_PROJECT_VIDEO_SUCCESS, {
    projectCardId,
    youtubeLinks,
  });

let cancelTokenChangeOrderProjectVideos;
export const changeOrderProjectVideosRequestAction = ({ form, projectCardId, dispatch }) =>
  new Promise((resolve) => {
    if (cancelTokenChangeOrderProjectVideos) {
      cancelTokenChangeOrderProjectVideos.cancel();
    }

    cancelTokenChangeOrderProjectVideos = axios.CancelToken.source();

    dispatch(changeOrderProjectVideosInProcessAction(true));

    api
      .put(`projects/${projectCardId}`, form, {
        cancelToken: cancelTokenChangeOrderProjectVideos.token,
      })
      .then(({ data: { data: { youtubeLinks = [] } = {} } = {} }) => {
        dispatch(changeOrderProjectVideosSuccessAction({ projectCardId, youtubeLinks }));
        resolve();
      })
      .catch((error) => {
        console.error(error);

        dispatch(changeOrderProjectVideosInProcessAction(axios.isCancel(error)));

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);
        resolve(errorData);
      });
  });
