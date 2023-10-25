import cloneDeep from 'lodash/cloneDeep';

import { DialogActionsConstants } from '@/constants/actions/dialog';
import { ProjectCardActionsConstants } from '@/constants/actions/projects/projectCard';
import DialogLocationsConstants from '@/constants/dialog/location';
import { WebSocketChatEventsConstants } from '@/constants/websocket/chat';
import { getDialogByIdMessageRequestAction } from '@/redux-actions/dialog/dialogActions';
import ReduxStoreService from '@/services/ReduxStoreService';

import { createWebsocketEvent, createWebsocketHandlers } from '../websocketHandler';

const getChatReducer = () => ({
  [DialogLocationsConstants.ADMIN]: ReduxStoreService.getInstance().store.getState().AdminDialogReducer,
  [DialogLocationsConstants.PROJECT]: ReduxStoreService.getInstance().store.getState().ProjectCommentsReducer,
});

const getDialogByIdMessage = ({ location, chatId, messageId, pack, isNew, isEdit, setMessagePosition, rootReplayTo }) => {
  getDialogByIdMessageRequestAction(
    location,
    chatId,
    messageId,
    pack,
    isNew,
    isEdit,
    setMessagePosition,
    rootReplayTo
  )(ReduxStoreService.getInstance().store.dispatch);
};

const handlers = createWebsocketHandlers({
  [WebSocketChatEventsConstants.CHAT_NEW_MESSAGE]: (
    { id: messageId, rootReplayTo },
    { location, setMessagePosition, chatId, isChat = true }
  ) => {
    const { store } = ReduxStoreService.getInstance();
    const {
      messages: messagesFromStore = [],
      dialogInfo: { lastMessageId } = {},
      dialogLastMessagesLoadedFromApi,
      counterMessages,
      totalCommentsCount,
    } = getChatReducer()[location];
    const findNewMessageIdx = messagesFromStore.findIndex(({ id }) => id === messageId);
    const findNewMessageOfReplies = messagesFromStore.find(({ id }) => id === rootReplayTo) || {};
    const { answers = [] } = findNewMessageOfReplies;
    const findNewMessageReplies = cloneDeep(answers);
    const findNewMessageOfRepliesIdx = findNewMessageReplies.findIndex(({ id }) => id === messageId);
    const findLastMessageInStore = messagesFromStore.findIndex(({ id }) => id === lastMessageId);

    if (
      dialogLastMessagesLoadedFromApi &&
      findNewMessageIdx <= -1 &&
      ((isChat && findLastMessageInStore > -1) || (findNewMessageOfRepliesIdx <= -1 && !isChat))
    ) {
      getDialogByIdMessage({
        location,
        chatId,
        messageId,
        isNew: true,
        isEdit: false,
        setMessagePosition,
        rootReplayTo: !isChat ? rootReplayTo : undefined,
      });
    } else if (isChat && findLastMessageInStore <= -1) {
      store.dispatch({
        type: `${location}_${DialogActionsConstants.CHAT_NEW_MESSAGE_ADD_COUNT}`,
      });
    }

    if (!isChat && !dialogLastMessagesLoadedFromApi) {
      store.dispatch({
        type: `${location}_${DialogActionsConstants.UPDATE_MESSAGES_COUNTER}`,
        payload: {
          counterMessages: !rootReplayTo ? counterMessages + 1 : counterMessages,
          totalCommentsCount: totalCommentsCount + 1,
        },
      });
    }
  },
  [WebSocketChatEventsConstants.CHAT_UPDATE_MESSAGE]: (
    { id: messageId, rootReplayTo },
    { location, chatId, setMessagePosition }
  ) => {
    const { messages: messagesFromStore = [] } = getChatReducer()[location];
    const findNewMessage = messagesFromStore.find(({ id }) => id === messageId);
    const findNewMessageReplies = messagesFromStore.find(({ id }) => id === rootReplayTo);

    if (findNewMessage || findNewMessageReplies) {
      getDialogByIdMessage({
        location,
        chatId,
        messageId,
        pack: false,
        isNew: false,
        isEdit: true,
        setMessagePosition,
        rootReplayTo,
      });
    }
  },
  [WebSocketChatEventsConstants.CHAT_READ_MESSAGE]: ({ messageIds = [] }, { location }) => {
    const { store } = ReduxStoreService.getInstance();

    store.dispatch({
      type: `${location}_${DialogActionsConstants.CHAT_READ_MESSAGE}`,
      payload: {
        location,
        messageIds,
      },
    });
  },
  [WebSocketChatEventsConstants.CHAT_DELETE_MESSAGE]: ({ id: messageId, rootReplayTo }, { location }) => {
    const { store } = ReduxStoreService.getInstance();

    store.dispatch({
      type: `${location}_${DialogActionsConstants.CHAT_DELETE_MESSAGE}`,
      payload: {
        location,
        messageId,
        rootReplayTo,
      },
    });
  },
  [WebSocketChatEventsConstants.CHAT_NEW_PARTICIPANT]: (participant, { location }) => {
    const { store } = ReduxStoreService.getInstance();

    store.dispatch({
      type: `${location}_${DialogActionsConstants.CHAT_NEW_PARTICIPANT}`,
      payload: {
        location,
        participant,
      },
    });
  },
  [WebSocketChatEventsConstants.CHAT_TYPING_EVENT]: ({ participantId }, { location }) => {
    const { store } = ReduxStoreService.getInstance();

    store.dispatch({
      type: `${location}_${DialogActionsConstants.CHAT_TYPING_EVENT}`,
      payload: {
        location,
        participantId,
      },
    });
  },
  [WebSocketChatEventsConstants.CHAT_ENABLED_TOGGLE]: ({ enabled }, { projectCardId }) => {
    const { store } = ReduxStoreService.getInstance();

    store.dispatch({
      type: ProjectCardActionsConstants.PROJECT_CHAT_ENABLED_TOGGLE,
      payload: {
        projectCardId,
        enabled,
      },
    });
  },
});

const WebsocketChatEvents = (eventName, data, callbackData) => createWebsocketEvent(eventName, data, handlers, callbackData);

export default WebsocketChatEvents;
