import api from '@/api';
import { ProjectRipLinkActionsConstants } from '@/constants/actions/project/ripLink';
import { extractErrorDataFromResponseApiUtil } from '@/utils/apiUtils';

import createAction from '../actionCreator';

const getProjectRipLinkBeforeConfirmInProcessAction = (getProjectRipLinkBeforeConfirmInProcess) =>
  createAction(ProjectRipLinkActionsConstants.GET_PROJECT_RIP_LINK_BEFORE_CONFIRM_IN_PROCESS, {
    getProjectRipLinkBeforeConfirmInProcess,
  });

const getProjectRipLinkBeforeConfirmSuccessAction = () =>
  createAction(ProjectRipLinkActionsConstants.GET_PROJECT_RIP_LINK_BEFORE_CONFIRM_SUCCESS);

export const getProjectRipLinkBeforeConfirmRequestAction = ({ projectId, dispatch }) =>
  new Promise((resolve, reject) => {
    dispatch(getProjectRipLinkBeforeConfirmInProcessAction(true));

    api
      .post(`projects/${projectId}/rip-link`)
      .then(({ data: { data } = {} }) => {
        dispatch(getProjectRipLinkBeforeConfirmSuccessAction());

        resolve(data);
      })
      .catch((error) => {
        console.error(error);

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);
        dispatch(getProjectRipLinkBeforeConfirmInProcessAction(false));

        reject(errorData);
      });
  });

const getProjectRipLinkConfirmInProcessAction = (getProjectRipLinkConfirmInProcess) =>
  createAction(ProjectRipLinkActionsConstants.GET_PROJECT_RIP_LINK_CONFIRM_IN_PROCESS, {
    getProjectRipLinkConfirmInProcess,
  });

const getProjectRipLinkConfirmSuccessAction = () =>
  createAction(ProjectRipLinkActionsConstants.GET_PROJECT_RIP_LINK_CONFIRM_SUCCESS);

export const getProjectRipLinkConfirmRequestAction = ({ projectId, agreementAccepted, dispatch }) =>
  new Promise((resolve, reject) => {
    dispatch(getProjectRipLinkConfirmInProcessAction(true));

    api
      .put(`projects/${projectId}/rip-link`, {
        agreementAccepted,
      })
      .then(({ data: { data: { ripLink } = {} } = {} }) => {
        dispatch(getProjectRipLinkConfirmSuccessAction());

        resolve({ ripLink });
      })
      .catch((error) => {
        console.error(error);

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);
        dispatch(getProjectRipLinkConfirmInProcessAction(false));

        reject(errorData);
      });
  });
