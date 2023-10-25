import { MessagesActionsConstants } from '@/constants/actions/components/messages';

export const showMessageAction =
  (messageId, messageData = {}, closeOtherMessages = true) =>
  (dispatch, getState) => {
    const messageListFromStore = getState().MessageReducer.activeMessageList;

    const filteredMessages = messageListFromStore.filter(({ popupId: id }) => id === messageId);

    const messageKey = filteredMessages.length > 0 ? `${messageId}-${filteredMessages.length + 1}` : messageId;

    const activeMessageList = closeOtherMessages
      ? [
          {
            messageKey,
            messageId,
            messageData,
          },
        ]
      : [
          ...messageListFromStore,
          {
            messageKey,
            messageId,
            messageData,
          },
        ];

    dispatch({
      type: MessagesActionsConstants.SHOW_MESSAGE,
      payload: {
        activeMessageList,
      },
    });
  };

export const closeMessageAction =
  (messageKey = null) =>
  (dispatch) => {
    dispatch({
      type: MessagesActionsConstants.CLOSE_MESSAGE,
      payload: {
        messageKey,
      },
    });
  };
