import { useCallback, useEffect } from 'react';

import { connect } from 'react-redux';

import Dialog from '@/components/common/Chat/Dialog';
import BaseWebsiteLayout from '@/components/layouts/BaseWebsiteLayout';
import PersonalPageLayout from '@/components/layouts/PersonalPageLayout';
import DialogLocationsConstants from '@/constants/dialog/location';
import { RoutePathsConstants } from '@/constants/routes/routes';
import ViewportHook from '@/hooks/viewport/ViewportHook';
import { getDialogLastMessagesRequestAction } from '@/redux-actions/dialog/dialogActions';

function ContactAdminWrapper({
  messages,
  searched,
  searchedIdx,
  searchInDialogInProcess,
  dialogIdLoadedFromApi,
  searchInDialogIds,
  getDialogLastMessagesInProcess,
  searchedId,
  sendMessageInProcess,
  searchedText,
  unreadMessages,
  readMessagesIds,
  canPrevMessages,
  canNextMessages,
  hasNewMessage,
  dialogLastMessagesLoadedFromApi,
  dialogInfo: { id: chatId, lastMessageId } = {},
  dialogInfo,
  participantsTyping,
  getDialogLastMessages,
}) {
  const { isNotDesktop } = ViewportHook();

  const onGetDialogLastMessages = useCallback(
    ({ messageId, direction, setMessagePosition, callback = () => {} } = {}) => {
      if (dialogIdLoadedFromApi && !getDialogLastMessagesInProcess) {
        getDialogLastMessages({
          location: DialogLocationsConstants.ADMIN,
          chatId,
          messageId,
          direction,
          setMessagePosition,
        }).then(callback);
      }
    },
    [chatId, dialogIdLoadedFromApi, getDialogLastMessages, getDialogLastMessagesInProcess]
  );

  useEffect(() => {
    if (dialogIdLoadedFromApi && !dialogLastMessagesLoadedFromApi) {
      onGetDialogLastMessages();
    }
  }, [dialogIdLoadedFromApi, dialogLastMessagesLoadedFromApi, onGetDialogLastMessages]);

  return (
    <BaseWebsiteLayout
      headSettings={{
        title: 'Contact Admin',
      }}
      withoutFooter
      shownBanners
    >
      <PersonalPageLayout withProfileBar={!isNotDesktop} withoutBottomPadding>
        <Dialog
          chatHeader="Contact Admin"
          activeMessagesList={messages}
          inProcess={getDialogLastMessagesInProcess}
          onGetDialogLastMessages={onGetDialogLastMessages}
          location={DialogLocationsConstants.ADMIN}
          locationUrl={RoutePathsConstants.CONTACT_ADMIN}
          chatId={chatId}
          searchInDialogInProcess={searchInDialogInProcess}
          searchInDialogIds={searchInDialogIds}
          searched={searched}
          searchedIdx={searchedIdx}
          searchedId={searchedId}
          searchedText={searchedText}
          sendMessageInProcess={sendMessageInProcess}
          unreadMessages={unreadMessages}
          readMessagesIds={readMessagesIds}
          canPrevMessages={canPrevMessages}
          canNextMessages={canNextMessages}
          hasNewMessage={hasNewMessage}
          lastMessageId={lastMessageId}
          dialogLastMessagesLoadedFromApi={dialogLastMessagesLoadedFromApi}
          dialogInfo={dialogInfo}
          participantsTyping={participantsTyping}
        />
      </PersonalPageLayout>
    </BaseWebsiteLayout>
  );
}

export default connect(
  (state) => ({
    dialogLastMessagesLoadedFromApi: state.AdminDialogReducer.dialogLastMessagesLoadedFromApi,
    dialogIdLoadedFromApi: state.AdminDialogReducer.dialogIdLoadedFromApi,
    dialogInfo: state.AdminDialogReducer.dialogInfo,
    getDialogLastMessagesInProcess: state.AdminDialogReducer.getDialogLastMessagesInProcess,
    messages: state.AdminDialogReducer.messages,
    searchInDialogInProcess: state.AdminDialogReducer.searchInDialogInProcess,
    searchInDialogIds: state.AdminDialogReducer.searchInDialogIds,
    searched: state.AdminDialogReducer.searched,
    searchedIdx: state.AdminDialogReducer.searchedIdx,
    searchedText: state.AdminDialogReducer.searchedText,
    searchedId: state.AdminDialogReducer.searchedId,
    sendMessageInProcess: state.AdminDialogReducer.sendMessageInProcess,
    unreadMessages: state.AdminDialogReducer.unreadMessages,
    readMessagesIds: state.AdminDialogReducer.readMessagesIds,
    canPrevMessages: state.AdminDialogReducer.canPrevMessages,
    canNextMessages: state.AdminDialogReducer.canNextMessages,
    hasNewMessage: state.AdminDialogReducer.hasNewMessage,
    participantsTyping: state.AdminDialogReducer.participantsTyping,
  }),
  (dispatch) => ({
    getDialogLastMessages: (params) => getDialogLastMessagesRequestAction(params)(dispatch),
  })
)(ContactAdminWrapper);
