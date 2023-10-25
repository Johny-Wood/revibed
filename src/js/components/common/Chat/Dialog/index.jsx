import { useEffect, useRef, useState } from 'react';

import cloneDeep from 'lodash/cloneDeep';

import DialogTyping from '@/components/common/Chat/_components/DialogTyping';
import SearchChat from '@/components/common/SearchChat';
import ViewportHook from '@/hooks/viewport/ViewportHook';

import DialogList from '../_components/DialogList';
import DialogNewMessage from '../_components/DialogNewMessage';
import styles from '../styles.module.scss';

const Dialog = ({
  activeMessagesList = [],
  onGetDialogLastMessages,
  inProcess,
  chatId,
  location,
  locationUrl,
  searchInDialogInProcess,
  searchInDialogIds,
  searched,
  searchedIdx,
  searchedText,
  searchedId,
  sendMessageInProcess,
  unreadMessages,
  readMessagesIds,
  canPrevMessages,
  canNextMessages,
  hasNewMessage,
  lastMessageId,
  dialogLastMessagesLoadedFromApi,
  dialogInfo,
  dialogInfo: { participants = [] } = {},
  participantsTyping,
}) => {
  const { isNotDesktop, height } = ViewportHook();

  const [replyMessageId, setReplyMessageId] = useState(-1);

  const dialogListAddMessagesRefs = useRef();
  const dialogListScrollToMessage = useRef();

  const participantsTypingClone = cloneDeep(participantsTyping);

  useEffect(() => {
    const withOutMeParticipants = participants.filter(({ isMe }) => !isMe).map(({ id }) => id);

    Object.keys(participantsTypingClone).forEach((participantKey) => {
      if (!withOutMeParticipants.includes(+participantKey)) {
        delete participantsTypingClone[+participantKey];
      }
    });
  }, [participants, participantsTypingClone]);

  return (
    <>
      <div className={styles.dialogHeader}>
        <DialogTyping location={location} dialogInfo={dialogInfo} participantsTyping={participantsTypingClone} />
        <SearchChat
          location={location}
          searched={searched}
          searchedIdx={searchedIdx}
          chatId={chatId}
          searchInDialogIds={searchInDialogIds}
          searchInDialogInProcess={searchInDialogInProcess}
          dialogListAddMessagesRefs={dialogListAddMessagesRefs.current}
          dialogListScrollToMessage={dialogListScrollToMessage.current}
        />
      </div>
      <div
        className={styles.dialog}
        style={{
          height: `calc(${height}px - (1rem * ${!isNotDesktop ? 420 - 30 + 28 : 240 + 28} / var(--font-size__small-int)))`,
        }}
      >
        <div
          className={styles.dialog__area}
          style={{
            height: `calc(${height}px - (1rem * ${
              !isNotDesktop ? 420 - 30 + 50 + 28 : 240 + 40 + 28
            } / var(--font-size__small-int)))`,
          }}
        >
          <DialogList
            height={height}
            isNotDesktop={isNotDesktop}
            location={location}
            locationUrl={locationUrl}
            chatId={chatId}
            searchedIdx={searchedIdx}
            searchedId={searchedId}
            activeMessagesList={activeMessagesList}
            onGetDialogLastMessages={onGetDialogLastMessages}
            inProcess={inProcess}
            searchedText={searchedText}
            searchInDialogIds={searchInDialogIds}
            registersAddMessageRefCallback={(f) => {
              dialogListAddMessagesRefs.current = f;
            }}
            registersDialogListScrollToMessageCallback={(f) => {
              dialogListScrollToMessage.current = f;
            }}
            sendMessageInProcess={sendMessageInProcess}
            unreadMessages={unreadMessages}
            readMessagesIds={readMessagesIds}
            canPrevMessages={canPrevMessages}
            canNextMessages={canNextMessages}
            hasNewMessage={hasNewMessage}
            dialogLastMessagesLoadedFromApi={dialogLastMessagesLoadedFromApi}
            setReplyMessageId={setReplyMessageId}
          />
        </div>
        <DialogNewMessage
          id="newContactAdminMessage"
          lastMessageId={lastMessageId}
          activeMessagesList={activeMessagesList}
          isNotDesktop={isNotDesktop}
          location={location}
          chatId={chatId}
          sendMessageInProcess={sendMessageInProcess}
          replyMessageId={replyMessageId}
          setReplyMessageId={setReplyMessageId}
          autoFocus={!isNotDesktop}
          minHeight={!isNotDesktop ? 48 : 38}
        />
      </div>
    </>
  );
};

export default Dialog;
