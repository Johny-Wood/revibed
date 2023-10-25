import { useState } from 'react';

import CommentsList from '@/components/common/Chat/_components/CommentsList';
import CommentsShowMore from '@/components/common/Chat/_components/CommentsShowMore';
import DialogNewMessage from '@/components/common/Chat/_components/DialogNewMessage';
import TransitionLayout from '@/components/layouts/TransitionLayouts/TransitionLayout';
import { MobileLayout } from '@/components/layouts/ViewportLayouts';
import MyAvatar from '@/components/user/MyAvatar';
import ViewportHook from '@/hooks/viewport/ViewportHook';

import styles from '../styles.module.scss';

const Comments = ({
  commentsInfo: { commentsCount = 0, commentsChatId: chatId } = {},
  activeMessagesList = [],
  onGetDialogLastMessages,
  disabled,
  inProcess,
  firstLoaded,
  location,
  sendMessageInProcess,
}) => {
  const { isNotDesktop } = ViewportHook();

  const [replyMessageId, setReplyMessageId] = useState(-1);
  const [showedNewMessageInput, setShowedNewMessageInput] = useState(false);

  return (
    <div className={styles.comments}>
      {!disabled && (
        <MobileLayout>
          <div className={styles.comments__showNewMessageInput}>
            <MyAvatar size={isNotDesktop ? 38 : 50} />
            <div
              className={styles.comments__showNewMessageDescription}
              onClick={() => {
                setShowedNewMessageInput(!showedNewMessageInput);
              }}
            >
              What do you think about project?
            </div>
          </div>
        </MobileLayout>
      )}
      {(showedNewMessageInput || !isNotDesktop) && !disabled && (
        <DialogNewMessage
          autoFocus={isNotDesktop}
          id="newComment"
          type="COMMENTS"
          minHeight={82}
          withAvatar
          activeMessagesList={activeMessagesList}
          isNotDesktop={isNotDesktop}
          location={location}
          chatId={chatId}
          sendMessageInProcess={sendMessageInProcess}
          replyMessageId={replyMessageId}
          setReplyMessageId={setReplyMessageId}
          setMessagePosition="prev"
          cancelCallback={() => {
            setShowedNewMessageInput(false);
          }}
          placeholder="What do you think about project?"
          introText="Comments are moderated. Please write correct and friendly."
          withSendButtonIcon={false}
        />
      )}
      {activeMessagesList.length > 0 || !firstLoaded ? (
        <CommentsList
          activeMessagesList={activeMessagesList}
          inProcess={inProcess}
          firstLoaded={firstLoaded}
          location={location}
          isNotDesktop={isNotDesktop}
          chatId={chatId}
          sendMessageInProcess={sendMessageInProcess}
          onGetDialogLastMessages={onGetDialogLastMessages}
          disabled={disabled}
          dialogMessageClassName={styles.dialogMessage}
          dialogMessageDateClassName={styles.dialogMessage__date}
        />
      ) : (
        <div className="t-center">no comments</div>
      )}
      <TransitionLayout isShown={commentsCount > activeMessagesList.length && activeMessagesList.length > 0}>
        <CommentsShowMore
          text="&darr; Show previous comments"
          inProcess={inProcess}
          onClick={() => {
            onGetDialogLastMessages({
              messageId: activeMessagesList[activeMessagesList.length - 1].id,
            });
          }}
        />
      </TransitionLayout>
    </div>
  );
};

export default Comments;
