import cloneDeep from 'lodash/cloneDeep';

import { DialogActionsConstants } from '@/constants/actions/dialog';
import DialogLocationsConstants from '@/constants/dialog/location';

import { createHandlers, createReducer } from '../handler';

const LIMIT_MESSAGES = 500;

const initialState = {
  getDialogIdInProcess: false,
  dialogIdLoadedFromApi: false,
  dialogInfo: {},

  readMessageInProcess: false,

  getDialogLastMessagesInProcess: false,
  dialogLastMessagesLoadedFromApi: false,
  messages: [],
  unreadMessages: [],
  unreadMessagesCount: 0,
  firstUnreadId: -1,
  readMessagesIds: [],
  canGetScrollId: -1,

  getDialogByIdMessageInProcess: false,

  sendMessageInProcess: false,

  searchInDialogInProcess: false,
  searchInDialogIds: [],
  searched: false,
  searchedText: '',
  searchedIdx: -1,
  searchedId: -1,

  canPrevMessages: true,
  canNextMessages: true,

  hasNewMessage: false,

  counterMessages: 0,
  totalCommentsCount: 0,

  participantsTyping: {},
};

const createLocalHandlers = (location) =>
  createHandlers({
    [`${location}_${DialogActionsConstants.UPDATE_MESSAGES_COUNTER}`]: (
      state,
      { counterMessages = state.counterMessages, totalCommentsCount = state.totalCommentsCount }
    ) => ({
      ...state,
      counterMessages,
      totalCommentsCount,
    }),

    [`${location}_${DialogActionsConstants.CHAT_NEW_MESSAGE}`]: (state, { message }) => {
      const { id: messageId } = message;

      return {
        ...state,
        messages: [...state.messages, message],
        dialogInfo: {
          ...state.dialogInfo,
          lastMessageId: messageId,
        },
      };
    },

    [`${location}_${DialogActionsConstants.CHAT_READ_MESSAGE}`]: (state, { messageIds = [] }) => {
      const messagesTmp = cloneDeep(state.messages);

      messagesTmp.forEach((message) => {
        if (messageIds.includes(message.id)) {
          message.read = true;
        }
      });

      return {
        ...state,
        messages: messagesTmp,
      };
    },

    [`${location}_${DialogActionsConstants.CHAT_DELETE_MESSAGE}`]: (state, { messageId, rootReplayTo }) => {
      const messagesTmp = cloneDeep(state.messages);
      let { counterMessages, totalCommentsCount } = state;

      counterMessages -= 1;
      totalCommentsCount -= 1;

      if (location === DialogLocationsConstants.ADMIN) {
        const foundMessageDeleteIdx = messagesTmp.findIndex(({ id: iMessageId }) => messageId === iMessageId);

        if (foundMessageDeleteIdx !== -1) {
          messagesTmp.splice(foundMessageDeleteIdx, 1);
        }
      } else if (!rootReplayTo) {
        const foundMessageDeleteIdx = messagesTmp.findIndex(({ id: iMessageId }) => messageId === iMessageId);

        if (foundMessageDeleteIdx !== -1) {
          messagesTmp[foundMessageDeleteIdx] = {
            ...messagesTmp[foundMessageDeleteIdx],
            text: '',
            deleted: true,
          };
        }
      } else {
        const foundRootMessageDeleteIdx = messagesTmp.findIndex(({ id: iRootReplayToId }) => rootReplayTo === iRootReplayToId);

        if (foundRootMessageDeleteIdx !== -1) {
          const { answers = [] } = messagesTmp[foundRootMessageDeleteIdx];
          const answersTmp = cloneDeep(answers);
          const foundMessageDeleteIdx = answersTmp.findIndex(({ id: iMessageId }) => messageId === iMessageId);

          if (foundMessageDeleteIdx !== -1) {
            answersTmp[foundMessageDeleteIdx] = {
              ...answersTmp[foundMessageDeleteIdx],
              text: '',
              deleted: true,
            };

            messagesTmp[foundRootMessageDeleteIdx] = {
              ...messagesTmp[foundRootMessageDeleteIdx],
              answersCount: messagesTmp[foundRootMessageDeleteIdx].answersCount - 1,
              answers: [...answersTmp],
            };
          }
        }
      }

      let { unreadMessagesCount, firstUnreadId } = state;

      if (firstUnreadId <= messageId || !firstUnreadId) {
        if (state.firstUnreadId === messageId) {
          firstUnreadId = null;
        }

        if (unreadMessagesCount - 1 > 0) {
          unreadMessagesCount -= 1;
        } else {
          unreadMessagesCount = 0;
        }
      }

      return {
        ...state,
        messages: messagesTmp,
        unreadMessagesCount,
        counterMessages: counterMessages > 0 ? counterMessages : 0,
        totalCommentsCount: totalCommentsCount > 0 ? totalCommentsCount : 0,
        firstUnreadId,
      };
    },

    [`${location}_${DialogActionsConstants.READ_MESSAGE_IN_PROCESS}`]: (state, { readMessageInProcess }) => ({
      ...state,
      readMessageInProcess,
    }),
    [`${location}_${DialogActionsConstants.READ_MESSAGE_SUCCESS}`]: (state) => ({
      ...state,
      readMessageInProcess: false,
      readMessagesIds: [],
      hasNewMessage: false,
    }),

    [`${location}_${DialogActionsConstants.GET_DIALOG_ID_IN_PROCESS}`]: (state, { getDialogIdInProcess }) => ({
      ...state,
      getDialogIdInProcess,
    }),
    [`${location}_${DialogActionsConstants.GET_DIALOG_ID_SUCCESS}`]: (
      state,
      { dialogInfo, dialogInfo: { unreadCount = 0, firstUnreadId } = {} }
    ) => ({
      ...state,
      getDialogIdInProcess: false,
      dialogIdLoadedFromApi: true,
      dialogInfo,
      unreadMessagesCount: unreadCount > 0 ? unreadCount : 0,
      firstUnreadId,
    }),

    [`${location}_${DialogActionsConstants.GET_DIALOG_BY_ID_MESSAGE_IN_PROCESS}`]: (
      state,
      { getDialogByIdMessageInProcess }
    ) => ({
      ...state,
      getDialogByIdMessageInProcess,
    }),
    [`${location}_${DialogActionsConstants.GET_DIALOG_BY_ID_MESSAGE_SUCCESS}`]: (
      state,
      {
        messages,
        messages: { id: messageId, isMe, owner: { id: ownerId } = {} } = {},
        isNew,
        isEdit,
        setMessagePosition,
        rootReplayTo: parentId,
      }
    ) => {
      let { counterMessages, totalCommentsCount } = state;
      const { participantsTyping: participantsTypingState } = state;

      const findNewMessage = state.messages.find((message) => message.id === messageId);
      let messagesUpdate = cloneDeep(state.messages);
      const participantsTyping = cloneDeep(participantsTypingState);

      if (isNew) {
        delete participantsTyping[ownerId];
      }

      if (isNew && !findNewMessage) {
        totalCommentsCount += 1;

        if (!parentId) {
          counterMessages += 1;
        }
      }

      if (isNew && !findNewMessage && !parentId) {
        messagesUpdate = setMessagePosition === 'prev' ? [messages, ...messagesUpdate] : [...messagesUpdate, messages];
      } else if (parentId && !isEdit) {
        const messagesPrevArr = cloneDeep(state.messages);
        const repliesMessagesParentIdx = messagesPrevArr.findIndex(({ id }) => id === parentId);

        if (repliesMessagesParentIdx > -1) {
          messagesPrevArr[repliesMessagesParentIdx] = {
            ...messagesPrevArr[repliesMessagesParentIdx],
            answers: [...messagesPrevArr[repliesMessagesParentIdx].answers, messages],
            answersCount: messagesPrevArr[repliesMessagesParentIdx].answersCount + 1,
          };

          messagesUpdate = messagesPrevArr;
        }
      } else if (isEdit && !parentId) {
        const messageEditIdx = messagesUpdate.findIndex((message) => message.id === messages.id);

        messagesUpdate[messageEditIdx] = messages;
      } else if (isEdit && parentId) {
        const messagesPrevArr = cloneDeep(state.messages);
        const repliesMessagesParentIdx = messagesPrevArr.findIndex(({ id }) => id === parentId);

        if (repliesMessagesParentIdx > -1) {
          const messageEditIdx = messagesPrevArr[repliesMessagesParentIdx].answers.findIndex(
            (message) => message.id === messages.id
          );

          const answersPrevArr = cloneDeep(messagesPrevArr[repliesMessagesParentIdx].answers);

          answersPrevArr[messageEditIdx] = messages;

          messagesPrevArr[repliesMessagesParentIdx] = {
            ...messagesPrevArr[repliesMessagesParentIdx],
            answers: answersPrevArr,
          };

          messagesUpdate = messagesPrevArr;
        }
      }

      return {
        ...state,
        getDialogByIdMessageInProcess: false,
        unreadMessages: isNew && !isMe ? [...state.unreadMessages, messageId] : [...state.unreadMessages],
        unreadMessagesCount: isNew && !isMe ? state.unreadMessagesCount + 1 : state.unreadMessagesCount,
        messages: messagesUpdate,
        firstUnreadId: isNew && !isMe ? messageId : state.firstUnreadId,
        hasNewMessage: state.hasNewMessage || isNew,
        counterMessages,
        totalCommentsCount,
        participantsTyping,
      };
    },

    [`${location}_${DialogActionsConstants.GET_DIALOG_LAST_MESSAGES_IN_PROCESS}`]: (
      state,
      { getDialogLastMessagesInProcess }
    ) => ({
      ...state,
      getDialogLastMessagesInProcess,
    }),
    [`${location}_${DialogActionsConstants.GET_DIALOG_LAST_MESSAGES_SUCCESS}`]: (
      state,
      { messages, messageId, parentId, setMessagePosition }
    ) => {
      let messagesArr = cloneDeep(messages);
      const messagesState = cloneDeep(state.messages);
      const unreadMessages = [];
      let { unreadMessagesCount, readMessagesIds, dialogInfo: { unreadCount } = {} } = state;

      let canPrevMessages = true;
      let canNextMessages = true;

      if (setMessagePosition === 'new') {
        messagesArr = [...messages];
        canPrevMessages = true;
        canNextMessages = false;
        unreadMessagesCount = 0;
        readMessagesIds = [];
        unreadCount = 0;
      } else {
        if (messageId && setMessagePosition && !parentId) {
          if (setMessagePosition === 'next') {
            messagesArr = [...messagesState, ...messages];

            if (messages.length <= 0) {
              canNextMessages = false;
            }
          } else {
            messagesArr = [...messages, ...messagesState];

            if (messages.length <= 0) {
              canPrevMessages = false;
            }
          }
        } else if (parentId) {
          const messagesPrevArr = cloneDeep(messagesState);
          const repliesMessagesParentIdx = messagesPrevArr.findIndex(({ id }) => id === parentId);

          if (repliesMessagesParentIdx > -1) {
            messagesPrevArr[repliesMessagesParentIdx] = {
              ...messagesPrevArr[repliesMessagesParentIdx],
              answers:
                setMessagePosition === 'next'
                  ? [...messagesPrevArr[repliesMessagesParentIdx].answers, ...messages]
                  : [...messages, ...messagesPrevArr[repliesMessagesParentIdx].answers],
            };

            messagesArr = messagesPrevArr;
          }
        }

        messagesArr.forEach(({ isMe, read, id }) => {
          if (!isMe && !read) {
            unreadMessages.push(id);
          }
        });
      }

      const messagesLength = messagesState.length + messages.length;
      const limitMessages = LIMIT_MESSAGES < messagesLength;

      if (limitMessages) {
        const messageDeleteLength = messagesLength - LIMIT_MESSAGES;

        const spliceStart = () => {
          messagesArr.splice(0, messageDeleteLength);
          canPrevMessages = true;
        };

        const spliceEnd = () => {
          messagesArr.splice(LIMIT_MESSAGES, messageDeleteLength);
          canNextMessages = true;
        };

        if (!parentId) {
          if (setMessagePosition === 'next') {
            spliceStart();
          } else if (setMessagePosition === 'prev') {
            spliceEnd();
          }
        } else if (setMessagePosition === 'prev') {
          spliceStart();
        } else if (setMessagePosition === 'next') {
          spliceEnd();
        }
      }

      return {
        ...state,
        getDialogLastMessagesInProcess: false,
        dialogLastMessagesLoadedFromApi: true,
        canGetScrollId: messages[0]?.id || undefined,
        messages: messagesArr,
        canPrevMessages,
        canNextMessages,
        unreadMessages,
        unreadMessagesCount,
        readMessagesIds,
        dialogInfo: {
          ...state.dialogInfo,
          unreadCount,
        },
      };
    },

    [`${location}_${DialogActionsConstants.SEARCH_IN_DIALOG_IN_PROCESS}`]: (state, { searchInDialogInProcess }) => ({
      ...state,
      searchInDialogInProcess,
    }),
    [`${location}_${DialogActionsConstants.SEARCH_IN_DIALOG_SUCCESS}`]: (state, { searchInDialogIds, searchedText }) => ({
      ...state,
      searchInDialogIds,
      searchedText,
      searchedIdx: searchInDialogIds.length > 0 ? 0 : -1,
      searchedId: searchInDialogIds[searchInDialogIds.length > 0 ? 0 : -1]?.id,
      searchInDialogInProcess: false,
    }),

    [`${location}_${DialogActionsConstants.SEARCH_OPEN}`]: (state) => ({
      ...state,
      searched: true,
    }),
    [`${location}_${DialogActionsConstants.SEARCH_CLOSE}`]: (state) => ({
      ...state,
      searched: false,
      searchedText: '',
      searchInDialogIds: [],
    }),

    [`${location}_${DialogActionsConstants.SEARCH_NEXT}`]: (state) => ({
      ...state,
      searchedIdx: state.searchedIdx + (state.searchedIdx < state.searchInDialogIds.length ? 1 : 0),
      searchedId: state.searchInDialogIds[state.searchedIdx + (state.searchedIdx < state.searchInDialogIds.length ? 1 : 0)]?.id,
    }),
    [`${location}_${DialogActionsConstants.SEARCH_PREV}`]: (state) => ({
      ...state,
      searchedIdx: state.searchedIdx - (state.searchedIdx > 0 ? 1 : 0),
      searchedId: state.searchInDialogIds[state.searchedIdx - (state.searchedIdx > 0 ? 1 : 0)]?.id,
    }),

    [`${location}_${DialogActionsConstants.READ_MESSAGE}`]: (state, { readMessagesIds = [] }) => {
      const unreadMessagesTmp = cloneDeep(state.unreadMessages);
      const { unreadMessagesCount: unreadMessagesCountState } = state;

      const unreadMessagesCount = unreadMessagesCountState - readMessagesIds.length;

      readMessagesIds.forEach((messageId) => {
        const unreadMessageIdx = unreadMessagesTmp.findIndex((index) => index === messageId);

        if (unreadMessageIdx > -1) {
          unreadMessagesTmp.splice(unreadMessageIdx, 1);
        }
      });

      return {
        ...state,
        readMessagesIds,
        unreadMessages: unreadMessagesTmp,
        unreadMessagesCount: unreadMessagesCount > 0 ? unreadMessagesCount : 0,
        dialogInfo: {
          ...state.dialogInfo,
          unreadCount: unreadMessagesCount > 0 ? state.dialogInfo.unreadCount : 0,
        },
      };
    },

    [`${location}_${DialogActionsConstants.CHAT_NEW_MESSAGE_ADD_COUNT}`]: (state) => ({
      ...state,
      unreadMessagesCount: state.unreadMessagesCount + 1,
    }),

    [`${location}_${DialogActionsConstants.SEND_MESSAGE_IN_PROCESS}`]: (state, { sendMessageInProcess }) => ({
      ...state,
      sendMessageInProcess,
    }),
    [`${location}_${DialogActionsConstants.SEND_MESSAGE_SUCCESS}`]: (
      state,
      { message, parentId, setMessagePosition = 'next' }
    ) => {
      let messagesPrevArr = cloneDeep(state.messages);
      let { counterMessages, totalCommentsCount } = state;

      totalCommentsCount += 1;

      if (parentId) {
        const repliesMessagesParentIdx = messagesPrevArr.findIndex(({ id }) => id === parentId);

        if (repliesMessagesParentIdx > -1) {
          messagesPrevArr[repliesMessagesParentIdx] = {
            ...messagesPrevArr[repliesMessagesParentIdx],
            answers:
              setMessagePosition === 'next'
                ? [...messagesPrevArr[repliesMessagesParentIdx].answers, message]
                : [message, ...messagesPrevArr[repliesMessagesParentIdx].answers],
            answersCount: messagesPrevArr[repliesMessagesParentIdx].answersCount + 1,
          };
        }
      } else {
        counterMessages += 1;
        messagesPrevArr = setMessagePosition === 'prev' ? [message, ...state.messages] : [...state.messages, message];
      }

      return {
        ...state,
        sendMessageInProcess: false,
        messages: messagesPrevArr,
        counterMessages,
        totalCommentsCount,
        dialogInfo: {
          ...state.dialogInfo,
          lastMessageId: message.id,
        },
      };
    },

    [`${location}_${DialogActionsConstants.CHAT_NEW_PARTICIPANT}`]: (state, { participant = {} }) => ({
      ...state,
      dialogInfo: {
        ...state.dialogInfo,
        participants: !state.dialogInfo?.participants ? [participant] : [...state.dialogInfo.participants, participant],
      },
    }),

    [`${location}_${DialogActionsConstants.CHAT_TYPING_EVENT}`]: (state, { participantId }) => ({
      ...state,
      participantsTyping: {
        ...state.participantsTyping,
        [participantId]: new Date().getTime(),
      },
    }),

    [`${location}_${DialogActionsConstants.CHAT_REMOVE_TYPING_EVENT}`]: (state, { participantId }) => {
      const { participantsTyping: participantsTypingState } = state;
      const participantsTyping = cloneDeep(participantsTypingState);

      delete participantsTyping[participantId];

      return {
        ...state,
        participantsTyping,
      };
    },

    [`${location}_${DialogActionsConstants.CLEAR_INITIAL_STATE}`]: () => ({
      ...initialState,
    }),
  });

const createDialogReducer = (state = initialState, action, location) => {
  const handlers = createLocalHandlers(location);

  return createReducer(state, action, handlers);
};

export { createHandlers, createReducer };

export default createDialogReducer;
