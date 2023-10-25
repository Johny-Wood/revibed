import axios from 'axios';
import qs from 'qs';

import api from '@/api';
import { CreateProjectActionsConstants } from '@/constants/actions/projects/createProject';
import { ProjectsLocationsConstants } from '@/constants/projects/location';
import { updatePersonalUserNotificationAction } from '@/redux-actions/personal/personalUserNotificationsActions';
import { analyticsPurchasePush, analyticsStandartPush } from '@/utils/analytics/analyticsPushers';
import { extractErrorDataFromResponseApiUtil } from '@/utils/apiUtils';
import { removeProjectByStoreUtil } from '@/utils/project/projectsListUtil';
import projectsStatusesUtil from '@/utils/project/projectsStatusesUtil';

import createAction from '../actionCreator';
import { deleteUnreadPersonalNotificationCountsEventAction } from '../personal/personalNotificationCountsActions';
import { replaceProjectCardAction } from '../project/projectCardActions';
import { resetGetProjectsFromApiAction, resetProjectsFiltersAndSortAction } from '../projects/projectsActions';

const analyticsAddToWishlistPush = ({ transactionId, cutsCount, projectPriceCut, projectName, projectId, projectPrice }) => {
  analyticsStandartPush({ ecommerce: null });
  analyticsStandartPush({
    event: 'add_to_wishlist',
    ecommerce: {
      items: [
        {
          item_name: projectName,
          item_id: projectId,
          price: projectPrice,
        },
      ],
    },
  });

  analyticsPurchasePush({
    transactionId,
    cutPrice: +(cutsCount * projectPriceCut).toFixed(2),
    projectId,
    projectName,
    projectPrice,
  });
};

export const createProjectClearAutoFillAction = (createProjectData) =>
  createAction(CreateProjectActionsConstants.CREATE_PROJECT_UPDATE_AUTO_FILL, {
    createProjectData,
  });

const createProjectAutoFillInProcessAction = (createProjectAutoFillInProcess) =>
  createAction(CreateProjectActionsConstants.CREATE_PROJECT_AUTO_FILL_IN_PROCESS, {
    createProjectAutoFillInProcess,
  });

const createProjectAutoFillSuccessAction = (createProjectData) =>
  createAction(CreateProjectActionsConstants.CREATE_PROJECT_AUTO_FILL_SUCCESS, {
    createProjectData,
  });

export const createProjectAutoFillRequestAction = (itemLink) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(createProjectAutoFillInProcessAction(true));

    api
      .get(`projects/info/item?itemLink=${itemLink}`)
      .then(({ data: { data: responseData = {} } }) => {
        dispatch(createProjectAutoFillSuccessAction(responseData));

        resolve(responseData);
      })
      .catch((error) => {
        console.error(error);

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);
        const { payload } = error;

        dispatch(createProjectAutoFillInProcessAction(false));
        reject(errorData, payload);
      });
  });

const costCalculationInProcessAction = (costCalculationInProcess) =>
  createAction(CreateProjectActionsConstants.COST_CALCULATION_IN_PROCESS, {
    costCalculationInProcess,
  });

let cancelTokenCostCalculation;
export const costCalculationRequestAction = ({ itemPrice, countryId, dispatch }) =>
  new Promise((resolve) => {
    if (cancelTokenCostCalculation) {
      cancelTokenCostCalculation.cancel();
    }

    cancelTokenCostCalculation = axios.CancelToken.source();

    dispatch(costCalculationInProcessAction(true));

    api
      .get('projects/info/price', {
        cancelToken: cancelTokenCostCalculation.token,
        params: {
          itemPrice: itemPrice || 0,
          countryId,
        },
        paramsSerializer(params) {
          return qs.stringify(params, { arrayFormat: 'repeat' });
        },
      })
      .then(({ data: { data: responseData = {} } }) => {
        dispatch(costCalculationInProcessAction(false));

        resolve(responseData);
      })
      .catch((error) => {
        dispatch(costCalculationInProcessAction(axios.isCancel(error)));
      });
  });

const createProjectInProcessAction = (createProjectInProcess) =>
  createAction(CreateProjectActionsConstants.CREATE_PROJECT_IN_PROCESS, {
    createProjectInProcess,
  });

const createProjectSuccessAction = () => createAction(CreateProjectActionsConstants.CREATE_PROJECT_SUCCESS);

const resetGetProjectsFromApiByStore = (dispatch, status, isEdit) => {
  if (projectsStatusesUtil.isDraftStatus(status) || projectsStatusesUtil.isOpenStatus(status)) {
    dispatch(resetGetProjectsFromApiAction(ProjectsLocationsConstants.MY_PROJECTS, !isEdit));

    if (!isEdit) {
      dispatch(
        resetProjectsFiltersAndSortAction({
          location: ProjectsLocationsConstants.MY_PROJECTS,
        })
      );
    }
  }
};

export const createProjectRequestAction =
  ({ formData, id, status, projectPriceCut, cutsCount, isToDraft }) =>
  (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(createProjectInProcessAction(true));

      api
        .post('projects/draft', formData)
        .then(
          ({
            data: {
              data: project = {},
              data: { id: projectId, title: projectName, amount: projectPrice } = {},
              payload: { transactionId } = {},
            } = {},
          }) => {
            dispatch(createProjectSuccessAction());

            if (isToDraft && id) {
              dispatch(
                replaceProjectCardAction({
                  project,
                  projectCardId: id,
                })
              );
            }

            if (projectsStatusesUtil.isOpenStatus(status)) {
              analyticsAddToWishlistPush({
                transactionId,
                cutsCount,
                projectPriceCut,
                projectName,
                projectId,
                projectPrice,
              });
            }

            resetGetProjectsFromApiByStore(dispatch, status);

            resolve();
          }
        )
        .catch((error) => {
          console.error(error);

          const { data: errorData } = extractErrorDataFromResponseApiUtil(error);
          const { payload } = error;

          dispatch(createProjectInProcessAction(false));
          reject(errorData, payload);
        });
    });

const editProjectInProcessAction = (editProjectInProcess) =>
  createAction(CreateProjectActionsConstants.EDIT_PROJECT_IN_PROCESS, {
    editProjectInProcess,
  });

export const editProjectRequestAction =
  ({ formData, id, status, projectPriceCut, cutsCount, isToDraft }) =>
  (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(editProjectInProcessAction(true));

      api
        .put(`projects/draft/${id}`, formData)
        .then(
          ({
            data: {
              data: project = {},
              data: { id: projectId, title: projectName, amount: projectPrice } = {},
              payload: { transactionId } = {},
            } = {},
          }) => {
            dispatch(editProjectInProcessAction(false));

            if (isToDraft && id) {
              dispatch(
                replaceProjectCardAction({
                  project,
                  projectCardId: id,
                })
              );
            }

            if (projectsStatusesUtil.isOpenStatus(status)) {
              analyticsAddToWishlistPush({
                transactionId,
                cutsCount,
                projectPriceCut,
                projectName,
                projectId,
                projectPrice,
              });
            }

            resetGetProjectsFromApiByStore(dispatch, status, true);

            resolve();
          }
        )
        .catch((error) => {
          console.error(error);

          const { data: errorData } = extractErrorDataFromResponseApiUtil(error);
          const { payload } = error;

          dispatch(editProjectInProcessAction(false));
          reject(errorData, payload);
        });
    });

const deleteProjectInProcessAction = (deleteProjectInProcess) =>
  createAction(CreateProjectActionsConstants.DELETE_PROJECT_IN_PROCESS, {
    deleteProjectInProcess,
  });

const deleteProjectSuccessAction = () => createAction(CreateProjectActionsConstants.DELETE_PROJECT_SUCCESS);

export const deleteProjectRequestAction = ({ projectId, location, dispatch }) =>
  new Promise((resolve, reject) => {
    dispatch(deleteProjectInProcessAction(true));

    api
      .delete(`projects/${projectId}`)
      .then(() => {
        dispatch(deleteProjectSuccessAction());

        dispatch(
          deleteUnreadPersonalNotificationCountsEventAction([projectId], {
            location,
          })
        );

        removeProjectByStoreUtil({ location, projectId });

        dispatch(
          updatePersonalUserNotificationAction({
            targetId: projectId,
            data: { target: {} },
          })
        );

        resolve();
      })
      .catch((error) => {
        console.error(error);

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);

        dispatch(deleteProjectInProcessAction(false));
        reject(errorData);
      });
  });

export const updateProjectExternalInfoAction = ({ externalInfo }) =>
  createAction(CreateProjectActionsConstants.UPDATE_PROJECT_EXTERNAL_INFO, {
    externalInfo,
  });
