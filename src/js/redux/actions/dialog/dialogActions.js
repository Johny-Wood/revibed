import qs from 'qs';

import api from '@/api';
import { DialogActionsConstants } from '@/constants/actions/dialog';
import { extractErrorDataFromResponseApiUtil } from '@/utils/apiUtils';

import createAction from '../actionCreator';

export const deleteTypingParticipantAction = (location, participantId) =>
  createAction(`${location}_${DialogActionsConstants.CHAT_REMOVE_TYPING_EVENT}`, {
    participantId,
  });

export const clearInitialStateAction = (location) => createAction(`${location}_${DialogActionsConstants.CLEAR_INITIAL_STATE}`);

export const updateMessagesCounterAction = (location, counterMessages, totalCommentsCount) =>
  createAction(`${location}_${DialogActionsConstants.UPDATE_MESSAGES_COUNTER}`, {
    counterMessages,
    totalCommentsCount,
  });

const getDialogIdInProcessAction = (location, getDialogIdInProcess) =>
  createAction(`${location}_${DialogActionsConstants.GET_DIALOG_ID_IN_PROCESS}`, {
    getDialogIdInProcess,
  });

const getDialogIdSuccessAction = (location, dialogInfo) =>
  createAction(`${location}_${DialogActionsConstants.GET_DIALOG_ID_SUCCESS}`, {
    dialogInfo,
  });

const getDialogLastMessagesInProcessAction = (location, getDialogLastMessagesInProcess) =>
  createAction(`${location}_${DialogActionsConstants.GET_DIALOG_LAST_MESSAGES_IN_PROCESS}`, {
    getDialogLastMessagesInProcess,
  });

const getDialogLastMessagesSuccessAction = (location, messages, messageId, direction, setMessagePosition, parentId) =>
  createAction(`${location}_${DialogActionsConstants.GET_DIALOG_LAST_MESSAGES_SUCCESS}`, {
    messages,
    messageId,
    parentId,
    direction,
    setMessagePosition,
  });

const getDialogByIdMessageInProcessAction = (location, getDialogByIdMessageInProcess) =>
  createAction(`${location}_${DialogActionsConstants.GET_DIALOG_BY_ID_MESSAGE_IN_PROCESS}`, {
    getDialogByIdMessageInProcess,
  });

const getDialogByIdMessageSuccessAction = (location, messages, isNew, isEdit, setMessagePosition, rootReplayTo) =>
  createAction(`${location}_${DialogActionsConstants.GET_DIALOG_BY_ID_MESSAGE_SUCCESS}`, {
    messages,
    isNew,
    isEdit,
    setMessagePosition,
    rootReplayTo,
  });

const searchInDialogInProcessAction = (location, searchInDialogInProcess) =>
  createAction(`${location}_${DialogActionsConstants.SEARCH_IN_DIALOG_IN_PROCESS}`, {
    searchInDialogInProcess,
  });

const searchInDialogSuccessAction = (location, searchInDialogIds, searchedText) =>
  createAction(`${location}_${DialogActionsConstants.SEARCH_IN_DIALOG_SUCCESS}`, {
    searchInDialogIds,
    searchedText,
  });

export const searchDialogOpenAction = (location) => createAction(`${location}_${DialogActionsConstants.SEARCH_OPEN}`);

export const searchDialogCloseAction = (location) => createAction(`${location}_${DialogActionsConstants.SEARCH_CLOSE}`);

export const searchDialogNextAction = (location) => createAction(`${location}_${DialogActionsConstants.SEARCH_NEXT}`);

export const searchDialogPrevAction = (location) => createAction(`${location}_${DialogActionsConstants.SEARCH_PREV}`);

const sendMessageInProcessAction = (location, sendMessageInProcess) =>
  createAction(`${location}_${DialogActionsConstants.SEND_MESSAGE_IN_PROCESS}`, {
    sendMessageInProcess,
  });

const sendMessageSuccessAction = (location, message, setMessagePosition, parentId) =>
  createAction(`${location}_${DialogActionsConstants.SEND_MESSAGE_SUCCESS}`, {
    message,
    parentId,
    setMessagePosition,
  });

const readMessageInProcessAction = (location, readMessageInProcess) =>
  createAction(`${location}_${DialogActionsConstants.READ_MESSAGE_IN_PROCESS}`, {
    readMessageInProcess,
  });

const readMessageSuccessAction = (location, messageIds) =>
  createAction(`${location}_${DialogActionsConstants.READ_MESSAGE_SUCCESS}`, {
    messageIds,
  });

export const readMessageAction = (location, readMessagesIds) =>
  createAction(`${location}_${DialogActionsConstants.READ_MESSAGE}`, {
    readMessagesIds,
  });

export const getDialogIdRequestAction = (location) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getDialogIdInProcessAction(location, true));

    api
      .get('chats', {
        params: {
          location,
        },
        paramsSerializer(params) {
          return qs.stringify(params, { arrayFormat: 'repeat' });
        },
      })
      .then(({ data: { data: responseData = {} } = {} }) => {
        const { id } = responseData;

        dispatch(getDialogIdSuccessAction(location, responseData));

        resolve(id);
      })
      .catch((error) => {
        console.error(error);

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);

        dispatch(getDialogIdInProcessAction(location, false));

        reject(errorData);
      });
  });

export const getDialogLastMessagesRequestAction =
  ({ location, chatId, messageId, parentId, direction, setMessagePosition, readAllMessages }) =>
  (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(getDialogLastMessagesInProcessAction(location, true));

      api
        .get(`chats/messages/${chatId}`, {
          params: {
            messageId,
            parentId,
            direction,
            readAllMessages,
          },
        })
        .then(({ data: { data: responseData = {} } = {} }) => {
          dispatch(
            getDialogLastMessagesSuccessAction(location, responseData, messageId, direction, setMessagePosition, parentId)
          );

          resolve();
        })
        .catch((error) => {
          console.error(error);

          const { data: errorData } = extractErrorDataFromResponseApiUtil(error);

          dispatch(getDialogLastMessagesInProcessAction(location, false));

          reject(errorData);
        });
    });

export const getDialogByIdMessageRequestAction =
  (location, chatId, messageId, pack = true, isNew = false, isEdit = false, setMessagePosition = 'next', rootReplayTo) =>
  (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(getDialogByIdMessageInProcessAction(location, true));

      api
        .get(`chats/messages/${chatId}/${messageId}`, {
          pack,
        })
        .then(({ data: { data: responseData = {} } = {} }) => {
          dispatch(getDialogByIdMessageSuccessAction(location, responseData, isNew, isEdit, setMessagePosition, rootReplayTo));

          resolve();
        })
        .catch((error) => {
          console.error(error);

          const { data: errorData } = extractErrorDataFromResponseApiUtil(error);

          dispatch(getDialogByIdMessageInProcessAction(location, false));

          reject(errorData);
        });
    });

export const searchInDialogRequestAction = (location, chatId, text) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(searchInDialogInProcessAction(location, true));

    api
      .get(`chats/messages/${chatId}/search`, {
        params: {
          text,
        },
      })
      .then(({ data: { data: responseData = {} } = {} }) => {
        dispatch(searchInDialogSuccessAction(location, responseData, text));
        dispatch(searchDialogOpenAction(location));

        resolve(responseData);
      })
      .catch((error) => {
        console.error(error);

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);

        dispatch(searchInDialogInProcessAction(location, false));

        reject(errorData);
      });
  });

export const sendMessageRequestAction = (location, chatId, formData, setMessagePosition, parentId) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(sendMessageInProcessAction(location, true));

    api
      .post(`chats/messages/${chatId}`, formData)
      .then(({ data: { data: responseData = {} } = {} }) => {
        dispatch(sendMessageSuccessAction(location, responseData, setMessagePosition, parentId));

        resolve();
      })
      .catch((error) => {
        console.error(error);

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);

        dispatch(sendMessageInProcessAction(location, false));

        reject(errorData);
      });
  });

export const readMessageRequestAction = (location, chatId, messageIds) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(readMessageInProcessAction(location, true));

    api
      .put(`chats/messages/${chatId}/read`, {
        messageIds,
      })
      .then(() => {
        dispatch(readMessageSuccessAction(location, messageIds));

        resolve();
      })
      .catch((error) => {
        console.error(error);

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);

        dispatch(readMessageInProcessAction(location, false));

        reject(errorData);
      });
  });
