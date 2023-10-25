import { Fragment, useState } from 'react';

import classNames from 'classnames';
import Collapse from 'react-collapse';

import CommentsShowMoreReplies from '@/components/common/Chat/_components/CommentsShowMoreReplies';
import DialogMessageWithReplyButton from '@/components/common/Chat/_components/DialogMessageWithReplyButton';
import DialogNewMessage from '@/components/common/Chat/_components/DialogNewMessage';
import TransitionLayout from '@/components/layouts/TransitionLayouts/TransitionLayout';
import Button from '@/components/ui/buttons/Button';
import MyAvatar from '@/components/user/MyAvatar';
import ArrowIcon from '@/icons/arrows/ArrowIcon';
import { textForLotsOfUtil } from '@/utils/textUtils';

import styles from './styles.module.scss';

function CommentsReplyList({
  messageData = {},
  messageData: { deleted, owner: { name: commentOwnerName = '' } = {}, answersCount, answers = [] } = {},
  parentId,
  location,
  isNotDesktop,
  chatId,
  disabled,
  sendMessageInProcess,
  onGetDialogLastMessages = () => {},
  showedRepliesNewMessage,
  setShowRepliesNewMessage = () => {},
  dialogMessageClassName,
  dialogMessageDateClassName,
}) {
  const [showedRepliesList, setShowRepliesList] = useState(false);
  const [replyMessageId, setReplyMessageId] = useState(-1);
  const [replayAuthor, setReplayAuthor] = useState('');

  const repliesListCount = answers.length;

  return (
    <div className={styles.commentsReplyList}>
      <DialogMessageWithReplyButton
        deleted={deleted}
        isNotDesktop={isNotDesktop}
        withMenu={false}
        withRead={false}
        disabled={disabled}
        messageData={messageData}
        setReplyMessageId={(messageId) => {
          setReplyMessageId(messageId);
        }}
        cancelCallback={() => {
          setShowRepliesNewMessage(-1);
          setReplyMessageId(-1);
          setReplayAuthor('');
        }}
        onClick={() => {
          setReplyMessageId(messageData.id);
          setReplayAuthor(commentOwnerName);
          setShowRepliesNewMessage(messageData.id);
          setShowRepliesList(true);
        }}
        dialogMessageClassName={dialogMessageClassName}
        dialogMessageDateClassName={dialogMessageDateClassName}
      >
        {answers && answers.length > 0 && (
          <Button
            type="button_string"
            className={classNames('show-more-button', showedRepliesList && 'opened')}
            onClick={() => {
              setShowRepliesList(!showedRepliesList);
            }}
          >
            <span className="title_xs t-medium c-blue">
              {!!answersCount && answersCount} {textForLotsOfUtil(answersCount, ['replying', 'replies'])}
            </span>
            <ArrowIcon size="small" color="var(--color__blue)" />
          </Button>
        )}
      </DialogMessageWithReplyButton>
      <Collapse isOpened={showedRepliesList}>
        <div className="w-100pct">
          <TransitionLayout isShown={answersCount > repliesListCount}>
            <CommentsShowMoreReplies
              text="&uarr; Show previous replies"
              onClick={() => {
                onGetDialogLastMessages({
                  direction: 'prev',
                  setMessagePosition: 'prev',
                  messageId: answers[0].id,
                  parentId,
                });
              }}
            />
          </TransitionLayout>
          <div className={styles.commentsReply__list}>
            {answers.map((messageReplyingData) => {
              const {
                deleted: replayDeleted,
                id,
                owner: { name: ownerName },
                replayTo: { id: replayToId, owner: { name: replayToOwnerName } = {} } = {},
              } = messageReplyingData;

              return (
                <Fragment key={`dialog-message-${id}`}>
                  <DialogMessageWithReplyButton
                    deleted={replayDeleted}
                    disabled={disabled}
                    isNotDesktop={isNotDesktop}
                    withMenu={false}
                    withRead={false}
                    withReplayMessage={false}
                    replayToOwnerName={replayToOwnerName}
                    replayToId={replayToId}
                    messageDataId={messageData.id}
                    messageData={messageReplyingData}
                    onClick={() => {
                      setReplyMessageId(id);
                      setReplayAuthor(ownerName);
                      setShowRepliesList(true);
                      setShowRepliesNewMessage(messageData.id);
                    }}
                    dialogMessageClassName={dialogMessageClassName}
                    dialogMessageDateClassName={dialogMessageDateClassName}
                  />
                </Fragment>
              );
            })}
          </div>
        </div>
      </Collapse>
      {showedRepliesNewMessage !== messageData.id && showedRepliesList && repliesListCount > 5 && (
        <div className={styles.comments__showNewMessageInput}>
          <MyAvatar size={isNotDesktop ? 38 : 50} />
          <div
            className={styles.comments__showNewMessageDescription}
            onClick={() => {
              setShowRepliesNewMessage(messageData.id);
            }}
          >
            Reply comment
          </div>
        </div>
      )}
      {showedRepliesNewMessage === messageData.id && !disabled && (
        <DialogNewMessage
          replayAuthor={replayAuthor}
          id="newReplay"
          type="COMMENTS"
          withAvatar
          activeMessagesList={answers}
          location={location}
          isNotDesktop={isNotDesktop}
          chatId={chatId}
          autoFocus
          sendMessageInProcess={sendMessageInProcess}
          replyMessageId={replyMessageId}
          parentId={parentId}
          setReplyMessageId={(messageId) => {
            setReplyMessageId(messageId);
          }}
          cancelCallback={() => {
            setShowRepliesNewMessage(-1);
            setReplyMessageId(-1);
            setReplayAuthor('');
          }}
          setMessagePosition="next"
          sendCallback={() => {
            setShowRepliesNewMessage(-1);
            setReplyMessageId(-1);
            setReplayAuthor('');
          }}
          avatarSize={38}
          withSendButtonIcon={false}
          className={styles.newMessage}
        />
      )}
    </div>
  );
}

export default CommentsReplyList;
