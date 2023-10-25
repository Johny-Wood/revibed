import api from '@/api';
import { ProjectRipperActionsConstants } from '@/constants/actions/projects/projectRipper';
import { extractErrorDataFromResponseApiUtil } from '@/utils/apiUtils';

import {
  transformProjectCardAdditionalExpensesAction,
  transformProjectCardDocumentAction,
  transformProjectCardRealConditions,
} from './projectCardActions';

import createAction from '../actionCreator';

const addProjectCardRipperInfoInProcessAction = (addProjectCardRipperInfoInProcess) =>
  createAction(ProjectRipperActionsConstants.ADD_PROJECT_CARD_RIPPER_INFO_IN_PROCESS, {
    addProjectCardRipperInfoInProcess,
  });

const addProjectCardRipperInfoSuccessAction = () =>
  createAction(ProjectRipperActionsConstants.ADD_PROJECT_CARD_RIPPER_INFO_SUCCESS);

export const addProjectCardRipperInfoRequestAction = (id, form) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(addProjectCardRipperInfoInProcessAction(true));

    api
      .put(`projects/${id}`, form)
      .then(
        ({
          data: { data: { documents = [], expenses = [], realMediaCondition, realSleeveCondition, conditionsComment } = {} },
        }) => {
          dispatch(
            transformProjectCardDocumentAction({
              projectCardId: id,
              documents,
            })
          );
          dispatch(
            transformProjectCardAdditionalExpensesAction({
              projectCardId: id,
              expenses,
            })
          );
          dispatch(
            transformProjectCardRealConditions({
              projectCardId: id,
              realConditions: {
                realMediaCondition,
                realSleeveCondition,
                conditionsComment,
              },
            })
          );
          dispatch(addProjectCardRipperInfoSuccessAction());

          resolve();
        }
      )
      .catch((error) => {
        console.error(error);

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);
        const { payload } = error;

        dispatch(addProjectCardRipperInfoInProcessAction(false));
        reject(errorData, payload);
      });
  });
