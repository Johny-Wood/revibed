import api from '@/api';
import { FeedbackActionsConstants } from '@/constants/actions/feedback';
import { extractErrorDataFromResponseApiUtil } from '@/utils/apiUtils';

import createAction from '../actionCreator';

const loadFeedbackTopicsInProcessAction = (loadFeedbackTopicsInProcess) =>
  createAction(FeedbackActionsConstants.LOAD_FEEDBACK_TOPICS_IN_PROCESS, {
    loadFeedbackTopicsInProcess,
  });

const loadFeedbackTopicsSuccessAction = (feedbackTopics) =>
  createAction(FeedbackActionsConstants.LOAD_FEEDBACK_TOPICS_SUCCESS, {
    feedbackTopics,
  });

export const loadFeedbackTopicsRequestAction = () => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(loadFeedbackTopicsInProcessAction(true));

    api
      .get('feedback/topics')
      .then(({ data: { data: responseData = {} } = {} }) => {
        dispatch(loadFeedbackTopicsSuccessAction(responseData));

        resolve();
      })
      .catch((error) => {
        console.error(error);

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);

        dispatch(loadFeedbackTopicsInProcessAction(false));

        reject(errorData);
      });
  });

const sendFeedbackTicketInProcessAction = (sendFeedbackTicketInProcess) =>
  createAction(FeedbackActionsConstants.SEND_FEEDBACK_TICKET_IN_PROCESS, {
    sendFeedbackTicketInProcess,
  });

const sendFeedbackTicketSuccessAction = () => createAction(FeedbackActionsConstants.SEND_FEEDBACK_TICKET_SUCCESS);

export const sendFeedbackTicketRequestAction = (params) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(sendFeedbackTicketInProcessAction(true));

    api
      .post('feedback/tickets', params)
      .then(({ data: { data: responseData = {} } = {} }) => {
        dispatch(sendFeedbackTicketSuccessAction(responseData));

        resolve();
      })
      .catch((error) => {
        console.error(error);

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);

        dispatch(sendFeedbackTicketInProcessAction(false));

        reject(errorData);
      });
  });

const sendFeedbackOwnerShipTicketInProcessAction = (sendFeedbackOwnerShipTicketInProcess) =>
  createAction(FeedbackActionsConstants.SEND_FEEDBACK_OWNER_SHIP_TICKET_IN_PROCESS, {
    sendFeedbackOwnerShipTicketInProcess,
  });

const sendFeedbackOwnerShipTicketSuccessAction = () =>
  createAction(FeedbackActionsConstants.SEND_FEEDBACK_OWNER_SHIP_TICKET_SUCCESS);

export const sendFeedbackOwnerShipTicketRequestAction = (formData) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(sendFeedbackOwnerShipTicketInProcessAction(true));

    api
      .post('feedback/master_ownership', formData)
      .then(({ data: { data: responseData = {} } = {} }) => {
        dispatch(sendFeedbackOwnerShipTicketSuccessAction(responseData));

        resolve();
      })
      .catch((error) => {
        console.error(error);

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);

        dispatch(sendFeedbackOwnerShipTicketInProcessAction(false));

        reject(errorData);
      });
  });
