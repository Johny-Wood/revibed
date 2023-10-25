import { Component, createRef } from 'react';

import classNames from 'classnames';
import emojiData from 'emoji-datasource-twitter';
import emojiRegexp from 'emoji-regex';
import cloneDeep from 'lodash/cloneDeep';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import DialogMessageReply from '@/components/common/Chat/_components/DialogMessageReply';
import FileUploader from '@/components/common/FileUploader';
import FileUploaderList from '@/components/common/FileUploader/_components/FileUploaderList';
import ScrollbarLayout from '@/components/layouts/ScrollbarLayout';
import TransitionLayout from '@/components/layouts/TransitionLayouts/TransitionLayout';
import { DesktopLayout, MobileLayout } from '@/components/layouts/ViewportLayouts';
import Button from '@/components/ui/buttons/Button';
import MyAvatar from '@/components/user/MyAvatar';
import { CommonMessagesConstants } from '@/constants/common/message';
import ComponentsCommonConstants from '@/constants/components/common';
import DialogLocationsConstants from '@/constants/dialog/location';
import { MessagesErrorConstants } from '@/constants/messages/error';
import { PopupCommonIdsConstants } from '@/constants/popups/id';
import { WebSocketChatEventsConstants } from '@/constants/websocket/chat';
import CloseIcon from '@/icons/control/close/CloseIcon';
import SendIcon from '@/icons/dialog/SendIcon';
import { showPopupAction } from '@/redux-actions/components/popupActions';
import { getDialogLastMessagesRequestAction, sendMessageRequestAction } from '@/redux-actions/dialog/dialogActions';
import WebSocketService from '@/services/WebSocketService';
import { handleErrorUtil } from '@/utils/apiUtils';
import { generateEmojiToImg } from '@/utils/emojiUtils';
import { pressShiftEnterKeyInputHandler } from '@/utils/inputHandlersUtil';

import styles from './styles.module.scss';

const EmojiPicker = dynamic(() => import('@/components/common/emoji/EmojiPicker'), { ssr: false });

const messageReplaceImgValue = (value = '') => {
  const messageImgRegExp = /<img.+?>/gi;
  const messageAltRegExp = /data-codepoints="(.+?)"/;

  return value.replace(messageImgRegExp, (match) => {
    const { short_name: shortName = '' } =
      emojiData.find(({ unified }) => unified === match.match(messageAltRegExp)[1].toUpperCase()) || {};

    return shortName ? generateEmojiToImg({ shortName }) : match;
  });
};

class DialogNewMessage extends Component {
  constructor(props) {
    super(props);

    this.newMessageRef = createRef();

    const { id } = props;

    this.initialState = {
      valuePresent: false,

      [`${id}Files`]: [],
      [`${id}BlobFiles`]: [],
    };

    this.state = this.initialState;
  }

  componentDidMount() {
    const { replayAuthor = '' } = this.props;

    this.newMessageRef.current.addEventListener('paste', this.clearInlineText);

    if (replayAuthor) {
      this.newMessageRef.current.innerHTML = `@${replayAuthor},&nbsp;`;

      this.setState({
        valuePresent: true,
      });
    }
  }

  componentDidUpdate(prevProps) {
    const { replayAuthor } = this.props;
    const { replayAuthor: replayAuthorPrev } = prevProps;

    if (replayAuthor !== replayAuthorPrev) {
      this.replaceReplayAuthor({
        newReplayAuthor: replayAuthor,
        prevReplayAuthor: replayAuthorPrev,
      });
    }
  }

  componentWillUnmount() {
    this.newMessageRef.current.removeEventListener('paste', this.clearInlineText);
  }

  // eslint-disable-next-line class-methods-use-this
  clearInlineText = (e) => {
    e.preventDefault();
    const text = e.clipboardData
      .getData('text/plain')
      .replace(emojiRegexp(), (match) => generateEmojiToImg({ shortName: match }) || match);

    document.execCommand('insertHTML', false, text);
  };

  replaceReplayAuthor = ({ newReplayAuthor = '', prevReplayAuthor = '' }) => {
    const { innerHTML = '' } = this.newMessageRef.current || {};

    this.newMessageRef.current.innerHTML = innerHTML.replace(prevReplayAuthor, newReplayAuthor);

    if (
      innerHTML
        .replace(prevReplayAuthor, newReplayAuthor)
        .replace(/&nbsp;/gi, ' ')
        .replace(`@${newReplayAuthor}, `, '').length <= 0
    ) {
      this.setState({
        valuePresent: false,
      });
    }
  };

  renderReplyMessage = () => {
    const { replyMessageId, activeMessagesList = [], setReplyMessageId = () => {} } = this.props;
    const replyMessage = activeMessagesList.find((message) => message.id === replyMessageId) || {};

    if (!replyMessage) {
      return null;
    }

    const { text, owner: { name } = {} } = replyMessage;

    return (
      <div className={styles.newMessage__replyBlock}>
        <Button
          className={styles.newMessage__replyClose}
          type="button_string"
          onClick={() => {
            setReplyMessageId();
          }}
        >
          <CloseIcon />
        </Button>
        <DialogMessageReply className={styles.newMessage__reply} name={name} text={text} />
      </div>
    );
  };

  disabledSendNewMessage = () => {
    const { sendMessageInProcess, id, replayAuthor } = this.props;

    const { valuePresent } = this.state;
    const { innerHTML = '' } = this.newMessageRef.current || {};

    return (
      // eslint-disable-next-line react/destructuring-assignment
      (this.state[`${id}Files`].length <= 0 &&
        (!valuePresent || innerHTML.replace(/&nbsp;/gi, ' ').replace(`@${replayAuthor}, `, '').length <= 0)) ||
      sendMessageInProcess
    );
  };

  onCancelMessage = () => {
    const { cancelCallback = () => {} } = this.props;

    this.setState({ ...this.initialState });
    this.newMessageRef.current.innerHTML = '';

    cancelCallback();
  };

  onSendNewMessage = () => {
    const { location, chatId, lastMessageId, activeMessagesList = [], getDialogLastMessages = () => {} } = this.props;

    if (this.disabledSendNewMessage()) {
      return;
    }

    if (lastMessageId) {
      const haveLastMessage = activeMessagesList.findIndex(({ id }) => id === lastMessageId);

      if (haveLastMessage <= -1) {
        getDialogLastMessages({
          location,
          chatId,
          messageId: lastMessageId + 1,
          direction: 'prev',
          setMessagePosition: 'new',
          readAllMessages: true,
        }).then(() => {
          this.sendNewMessage();
        });
      } else {
        this.sendNewMessage();
      }
    } else {
      this.sendNewMessage();
    }
  };

  sendNewMessage = () => {
    const {
      id,
      sendMessage,
      location,
      chatId,
      setReplyMessageId,
      setMessagePosition,
      parentId,
      sendCallback = () => {},
      showPopup,
    } = this.props;

    sendMessage(location, chatId, this.buildFormNewMessage(), setMessagePosition, parentId)
      .then(() => {
        setReplyMessageId();
        sendCallback();

        this.newMessageRef.current.innerHTML = '';

        this.setState({
          valuePresent: false,
          [`${id}Files`]: [],
          [`${id}BlobFiles`]: [],
        });
      })
      .catch(({ error = {} }) => {
        if (error) {
          handleErrorUtil(error, {
            USER_COMMENT_DISABLED: () => {
              showPopup(PopupCommonIdsConstants.WarningPopup, {
                text: MessagesErrorConstants.USER_COMMENT_DISABLED,
              });
            },
            CHAT_DISABLED: () => {
              showPopup(PopupCommonIdsConstants.WarningPopup, {
                text: MessagesErrorConstants.CHAT_DISABLED,
              });
            },
          });
        }
      });
  };

  buildFormNewMessage = () => {
    const { id, replayAuthor, replyMessageId } = this.props;

    const { innerHTML = '' } = this.newMessageRef.current || {};

    const formData = new FormData();

    // eslint-disable-next-line react/destructuring-assignment
    for (let i = 0; i < this.state[`${id}BlobFiles`].length; i++) {
      // eslint-disable-next-line react/destructuring-assignment
      const { file } = this.state[`${id}BlobFiles`][i];
      formData.append('attachments', file || '');
    }

    const text = this.messageReplaceTagsValue(messageReplaceImgValue(innerHTML))
      .replace(`@${replayAuthor}, `, '')
      .replace(/[\r\n]+/g, '\n');

    formData.append('text', text);
    formData.append('replayTo', replyMessageId);

    return formData;
  };

  onRemove = (id) => {
    const { id: componentId } = this.props;

    // eslint-disable-next-line react/destructuring-assignment,react/no-access-state-in-setstate
    const tmpFiles = cloneDeep(this.state[`${componentId}Files`]);
    const findIdx = tmpFiles.findIndex((f) => f.id === id);

    if (findIdx > -1) {
      tmpFiles.splice(findIdx, 1);
    }

    // eslint-disable-next-line react/destructuring-assignment,react/no-access-state-in-setstate
    const tmpBlobFiles = cloneDeep(this.state[`${componentId}BlobFiles`]);
    const findBlobIdx = tmpBlobFiles.findIndex((f) => f.id === id);
    tmpBlobFiles.splice(findBlobIdx, 1);

    this.setState({
      [`${componentId}Files`]: tmpFiles,
      [`${componentId}BlobFiles`]: tmpBlobFiles,
    });
  };

  isCommentsType = () => {
    const { type } = this.props;

    return type === 'COMMENTS';
  };

  renderFileUploader = () => {
    const { id } = this.props;

    return (
      <FileUploader
        attachDescription={this.isCommentsType() ? 'attach file' : ''}
        buttonAttachFileClassName={styles.buttonAttachFile}
        blockClassName={styles.uploadBlock}
        uploadAttachDescriptionClassName={styles.upload__attachDescription}
        // eslint-disable-next-line react/destructuring-assignment
        files={this.state[`${id}Files`]}
        // eslint-disable-next-line react/destructuring-assignment
        filesBlob={this.state[`${id}BlobFiles`]}
        inputId={`${id}Files`}
        maxFiles={5}
        maxSize={10}
        multiple
        callBackUploadFiles={(files) => {
          this.setState({
            [`${id}Files`]: files,
          });
        }}
        callBackUploadBlobFiles={(files) => {
          this.setState({
            [`${id}BlobFiles`]: files,
          });
        }}
      />
    );
  };

  renderUploadedList = () => {
    const { id } = this.props;

    return (
      // eslint-disable-next-line react/destructuring-assignment
      <TransitionLayout isShown={this.state[`${id}Files`].length > 0}>
        <FileUploaderList
          className={styles.uploadList}
          containerClassName={styles.uploadList__container}
          // eslint-disable-next-line react/destructuring-assignment
          files={this.state[`${id}Files`]}
          onRemove={this.onRemove}
          withScrollBar
          inline
        />
      </TransitionLayout>
    );
  };

  sendWebsocketTypingEvent = (text = '') => {
    const { chatId } = this.props;

    if (this.isCommentsType()) {
      return;
    }

    WebSocketService.socketClient().send(
      `/chat/${chatId}`,
      {},
      JSON.stringify({
        event: WebSocketChatEventsConstants.CHAT_TYPING_EVENT,
        data: {
          text,
        },
      })
    );
  };

  addEmojiCallBack = ({ image, shortName }) => {
    const { innerHTML = '' } = this.newMessageRef.current || {};

    if (image) {
      this.newMessageRef.current.innerHTML = `${innerHTML}${generateEmojiToImg({ shortName })}`;

      // this.sendWebsocketTypingEvent(newValue);

      this.setState({
        valuePresent: true,
      });
    }
  };

  // eslint-disable-next-line class-methods-use-this
  messageReplaceTagsValue = (value = '') => value.replace(/<br>/gi, '\u000A').replace(/&nbsp;/gi, ' ');

  renderNewMessageInput = () => {
    const {
      replyMessageId,
      onFocus,
      minHeight = 38,
      id = 'newMessage',
      placeholder = 'Type a message...',
      replayAuthor = '',
    } = this.props;

    const { valuePresent } = this.state;

    return (
      <div className={styles.newMessage__input}>
        <div className="input-block">
          <div className="input">
            <TransitionLayout isShown={replyMessageId >= 0 && !this.isCommentsType()}>
              <>{this.renderReplyMessage()}</>
            </TransitionLayout>
            {!this.isCommentsType() && this.renderUploadedList()}
            <ScrollbarLayout height={minHeight} maxHeight={minHeight * 5}>
              <>
                <div
                  contentEditable
                  aria-multiline
                  role="textbox"
                  aria-label="input"
                  tabIndex="0"
                  className="text"
                  id={id}
                  suppressContentEditableWarning
                  ref={this.newMessageRef}
                  onFocus={onFocus}
                  onInput={(e) => {
                    const { currentTarget: { innerHTML } = {} } = e || {};
                    const newValue = messageReplaceImgValue(this.messageReplaceTagsValue(innerHTML)).replace(
                      `@${replayAuthor}, `,
                      ''
                    );

                    this.setState({
                      valuePresent: /[^\s]/.test(newValue),
                    });

                    this.sendWebsocketTypingEvent(newValue);
                  }}
                  onKeyUp={(e) => {
                    pressShiftEnterKeyInputHandler(e, this.onSendNewMessage);
                  }}
                />
                <TransitionLayout isShown={!valuePresent && !replayAuthor}>
                  <div className="input__placeholder">{placeholder}</div>
                </TransitionLayout>
              </>
            </ScrollbarLayout>
          </div>
        </div>
        {!this.isCommentsType() && (
          <DesktopLayout>
            <EmojiPicker
              className={styles.emojiContainerBlock}
              containerClassName={styles.emojiContainer}
              sectionClassName={styles.emojiContainer__section}
              addEmojiCallBack={this.addEmojiCallBack}
            />
          </DesktopLayout>
        )}
      </div>
    );
  };

  renderAvatar = () => {
    const { withAvatar, isNotDesktop, avatarSize = 50 } = this.props;

    if (!withAvatar) {
      return null;
    }

    return <MyAvatar size={isNotDesktop ? 38 : avatarSize} />;
  };

  renderButtonSend = () => {
    const { withSendButtonIcon } = this.props;

    return (
      <Button
        className="button_send"
        disabled={this.disabledSendNewMessage()}
        onClick={() => this.onSendNewMessage()}
        size={this.isCommentsType() ? 'small-30' : ComponentsCommonConstants.Size.LARGE}
      >
        {withSendButtonIcon ? (
          <>
            <DesktopLayout>
              <span className="text">Send</span>
            </DesktopLayout>
            <MobileLayout>
              <SendIcon />
            </MobileLayout>
          </>
        ) : (
          <span className="text">Send</span>
        )}
      </Button>
    );
  };

  renderButtonCancel = () => (
    <Button
      className="button_cancel"
      onClick={() => this.onCancelMessage()}
      type="button_string"
      size={this.isCommentsType() ? 'small-30' : ComponentsCommonConstants.Size.LARGE}
      text={CommonMessagesConstants.DELETE}
    />
  );

  renderNewMessageStructure = () => {
    const { introText } = this.props;

    if (this.isCommentsType()) {
      return (
        <>
          {this.renderAvatar()}
          <div className={styles.newMessage__container}>
            <div className={styles.newMessage__inputBlock}>{this.renderNewMessageInput()}</div>
            <div className={styles.newMessage__controlBlock}>
              {this.renderFileUploader()}
              <DesktopLayout>
                <EmojiPicker
                  className={styles.emojiContainerBlock}
                  containerClassName={styles.emojiContainer}
                  sectionClassName={styles.emojiContainer__section}
                  addEmojiCallBack={this.addEmojiCallBack}
                />
              </DesktopLayout>
              <div className={styles.newMessage__controlBlock__doubleButtons}>
                {this.renderButtonCancel()}
                {this.renderButtonSend()}
              </div>
            </div>
            {this.renderUploadedList()}
            {!!introText && (
              <DesktopLayout>
                <div className={styles.newMessage__intro}>
                  <p className="text">{introText}</p>
                </div>
              </DesktopLayout>
            )}
          </div>
        </>
      );
    }

    return (
      <>
        {this.renderAvatar()}
        {this.renderFileUploader()}
        {this.renderNewMessageInput()}
        {this.renderButtonSend()}
      </>
    );
  };

  render() {
    const { className, location } = this.props;

    return (
      <div
        className={classNames([
          styles.newMessage,
          location === DialogLocationsConstants.ADMIN && styles.newMessage_dialog,
          location === DialogLocationsConstants.PROJECT && styles.newMessage_comments,
          className,
        ])}
      >
        {this.renderNewMessageStructure()}
      </div>
    );
  }
}

DialogNewMessage.defaultProps = {
  className: '',
  introText: '',
  withSendButtonIcon: true,
  onFocus: () => {},
};

DialogNewMessage.propTypes = {
  className: PropTypes.string,
  introText: PropTypes.string,
  withSendButtonIcon: PropTypes.bool,
  onFocus: PropTypes.func,
};

export default connect(
  () => ({}),
  (dispatch) => ({
    getDialogLastMessages: (params) => getDialogLastMessagesRequestAction(params)(dispatch),
    sendMessage: (location, chatId, formData, setMessagePosition, parentId) =>
      sendMessageRequestAction(location, chatId, formData, setMessagePosition, parentId)(dispatch),
    showPopup: (popupId, popupData = {}, closeOtherPopups = true) => {
      dispatch(showPopupAction(popupId, popupData, closeOtherPopups));
    },
  })
)(DialogNewMessage);
