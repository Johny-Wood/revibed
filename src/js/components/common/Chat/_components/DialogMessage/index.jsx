import { useState } from 'react';

import classNames from 'classnames';
import PropTypes from 'prop-types';

import DialogMessageMenu from '@/components/common/Chat/_components/DialogMessage/_components/DialogMessageMenu';
import DialogMessageReply from '@/components/common/Chat/_components/DialogMessageReply';
import EmojiReplaceWrapper from '@/components/common/emoji/EmojiReplaceWrapper';
import FileUploaderList from '@/components/common/FileUploader/_components/FileUploaderList';
import NormalizeDate from '@/components/common/NormalizeDate';
import TransitionLayout from '@/components/layouts/TransitionLayouts/TransitionLayout';
import Button from '@/components/ui/buttons/Button';
import NickName from '@/components/user/NickName';
import UserAvatar from '@/components/user/UserAvatar';
import DialogLocationsConstants from '@/constants/dialog/location';
import MessageReadIcon from '@/icons/dialog/MessageReadIcon';
import MessageUnreadIcon from '@/icons/dialog/MessageUnreadIcon';
import DotsMenuIcon from '@/icons/Dots/DotsMenuIcon';

import styles from './styles.module.scss';

const renderDate = (createdAt, updatedAt, dialogMessageDateClassName) => (
  <>
    {updatedAt && (
      <span className={classNames(styles.dialogMessage__date, styles.dialogMessage__updateDate, dialogMessageDateClassName)}>
        (changed)
      </span>
    )}
    <NormalizeDate className={classNames(styles.dialogMessage__date, dialogMessageDateClassName)} date={updatedAt || createdAt} />
  </>
);

const replyCallback = (setReplyMessageId, messageId) => {
  setReplyMessageId(messageId);
};

const closeMenuCallback = (setShowMessageMenu) => {
  setShowMessageMenu(false);
};

function DialogMessage({
  isNotDesktop,
  withReplayMessage,
  withRead,
  withMenu,
  innerRefFunction,
  setReplyMessageId,
  searchedId,
  hideUserInfo,
  avatarSize,
  replayToId,
  replayToOwnerName,
  dialogMessageDateClassName,
  messageDataId,
  location,
  messageData: {
    id,
    text = '',
    attachments = [],
    createdAt,
    updatedAt,
    read = false,
    isMe = false,
    deleted = false,
    owner: { name = '', avatar, type: userType, targetId: userId } = {},
    replayTo,
    replayTo: { text: replyText, id: replyId, deleted: replyDeleted, owner: { name: replyName } = {} } = {},
  } = {},
}) {
  const [showedMessageMenuButton, setShowMessageMenuButton] = useState(false);
  const [showedMessageMenu, setShowMessageMenu] = useState(false);

  return (
    <div
      ref={(message) => {
        innerRefFunction(id, { current: message });
      }}
      className={classNames(
        styles.dialogMessage,
        location === DialogLocationsConstants.ADMIN && styles.dialogMessage_locationAdmin,
        isMe ? styles.dialogMessage_MY_MESSAGE : styles.dialogMessage_NOT_MY_MESSAGE,
        searchedId === id && styles.dialogMessage_focused
      )}
    >
      <div
        onMouseEnter={() => {
          if (withMenu) {
            setShowMessageMenuButton(true);
          }
        }}
        onMouseLeave={() => {
          if (withMenu) {
            setShowMessageMenuButton(false);
            setShowMessageMenu(false);
          }
        }}
        className={classNames([styles.dialogMessage__block, deleted && 'o-50'])}
      >
        {showedMessageMenuButton && withMenu && (
          <Button
            type="button_string"
            className={styles.dialogMessage__menu}
            onClick={() => {
              if (withMenu) {
                setShowMessageMenu(!showedMessageMenu);
              }
            }}
          >
            <DotsMenuIcon />
          </Button>
        )}
        <DialogMessageMenu
          className={styles.dialogMessage__context}
          isShow={showedMessageMenu && showedMessageMenuButton && withMenu}
          replyCallback={() => {
            replyCallback(setReplyMessageId, id);
            closeMenuCallback(setShowMessageMenu);
          }}
        />
        {!hideUserInfo && (
          <UserAvatar src={avatar} size={isNotDesktop ? 38 : avatarSize} userId={userId} isRoute={userType !== 'ADMIN'} />
        )}
        <div className={styles.dialogMessage__message}>
          <div className={styles.dialogMessage__header}>
            {!hideUserInfo ? (
              <NickName name={name} withFlag={false} fontWeight="bold" userId={userId} isRoute={userType !== 'ADMIN'} />
            ) : (
              <span />
            )}
            <div className={styles.dialogMessage__info}>
              {renderDate(createdAt, updatedAt, dialogMessageDateClassName)}
              {isMe && withRead && (
                <div className={styles.dialogMessage__indicator}>
                  <MessageUnreadIcon />
                  {read && <MessageReadIcon />}
                </div>
              )}
            </div>
          </div>
          {!deleted && replayTo && withReplayMessage && (
            <DialogMessageReply text={replyText} deleted={replyDeleted} name={replyName || replyId} />
          )}
          <div className={styles.dialogMessage__content}>
            <div className={styles.message}>
              {!deleted ? (
                <>
                  {replayToId !== messageDataId && replayToOwnerName && (
                    <>
                      <span className="c-blue" title={replayToOwnerName}>
                        @{replayToOwnerName}
                      </span>
                      ,&nbsp;
                    </>
                  )}
                  <EmojiReplaceWrapper text={text} />
                </>
              ) : (
                <i>Comment deleted</i>
              )}
            </div>
            <TransitionLayout isShown={attachments.length > 0}>
              <FileUploaderList files={attachments} readOnly withScrollBar />
            </TransitionLayout>
          </div>
        </div>
      </div>
    </div>
  );
}

DialogMessage.defaultProps = {
  withReplayMessage: true,
  withRead: true,
  withMenu: true,
  hideUserInfo: false,
  messageDataId: -1,
  replayToId: -1,
  searchedId: -1,
  avatarSize: 50,
  replayToOwnerName: '',
  messageData: {},
  innerRefFunction: () => {},
  setReplyMessageId: () => {},
};

DialogMessage.propTypes = {
  withReplayMessage: PropTypes.bool,
  withRead: PropTypes.bool,
  withMenu: PropTypes.bool,
  hideUserInfo: PropTypes.bool,
  messageDataId: PropTypes.number,
  replayToId: PropTypes.number,
  searchedId: PropTypes.number,
  avatarSize: PropTypes.number,
  messageData: PropTypes.object,
  replayToOwnerName: PropTypes.string,
  innerRefFunction: PropTypes.func,
  setReplyMessageId: PropTypes.func,
};

export default DialogMessage;
