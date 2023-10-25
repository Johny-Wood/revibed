import api from '@/api';
import { ProjectInviteActionsConstants } from '@/constants/actions/projects/projectInvite';
import { extractErrorDataFromResponseApiUtil } from '@/utils/apiUtils';

import createAction from '../actionCreator';

const projectInviteInProcessAction = (projectInviteInProcess) =>
  createAction(ProjectInviteActionsConstants.PROJECT_INVITE_IN_PROCESS, {
    projectInviteInProcess,
  });

const projectInviteSuccessAction = () => createAction(ProjectInviteActionsConstants.PROJECT_INVITE_SUCCESS);

export const projectInviteRequestAction =
  ({ projectId, email }) =>
  (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(projectInviteInProcessAction(true));

      api
        .put(`projects/${projectId}/invites`, {
          email,
        })
        .then(({ data: { data: responseData = {} } = {} }) => {
          dispatch(projectInviteSuccessAction(responseData));

          resolve();
        })
        .catch((error) => {
          console.error(error);

          const { data: errorData } = extractErrorDataFromResponseApiUtil(error);

          dispatch(projectInviteInProcessAction(false));

          reject(errorData);
        });
    });
