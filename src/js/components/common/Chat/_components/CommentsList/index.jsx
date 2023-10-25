import { Fragment, useState } from 'react';

import CommentsReplyList from '@/components/common/Chat/_components/CommentsReplyList';

import styles from './styles.module.scss';

function CommentsList({
  activeMessagesList,
  location,
  isNotDesktop,
  chatId,
  sendMessageInProcess,
  disabled,
  onGetDialogLastMessages = () => {},
  dialogMessageClassName,
  dialogMessageDateClassName,
}) {
  const [showedRepliesNewMessage, setShowRepliesNewMessage] = useState(-1);

  return (
    <div className={styles.comments__list}>
      {activeMessagesList.map((messageData) => {
        const { id } = messageData;

        return (
          <Fragment key={`dialog-message-${id}`}>
            <CommentsReplyList
              location={location}
              isNotDesktop={isNotDesktop}
              chatId={chatId}
              sendMessageInProcess={sendMessageInProcess}
              messageData={messageData}
              parentId={id}
              onGetDialogLastMessages={onGetDialogLastMessages}
              showedRepliesNewMessage={showedRepliesNewMessage}
              setShowRepliesNewMessage={(parentTackedId) => {
                setShowRepliesNewMessage(parentTackedId);
              }}
              disabled={disabled}
              dialogMessageClassName={dialogMessageClassName}
              dialogMessageDateClassName={dialogMessageDateClassName}
            />
          </Fragment>
        );
      })}
    </div>
  );
}

export default CommentsList;
