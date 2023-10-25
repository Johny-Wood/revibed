import { Component, createRef, Fragment } from 'react';

import isEqual from 'lodash/isEqual';
import { connect } from 'react-redux';
import Scrollbar from 'react-scrollbars-custom';

import DialogMessage from '@/components/common/Chat/_components/DialogMessage';
import DialogScrollBottomButton from '@/components/common/Chat/_components/DialogScrollBottomButton';
import TransitionLayout from '@/components/layouts/TransitionLayouts/TransitionLayout';
import Preloader from '@/components/ui/Preloader';
import { CommonScrollbarLocationsConstants } from '@/constants/common/scrollBar';
import { readMessageAction, readMessageRequestAction } from '@/redux-actions/dialog/dialogActions';
import ScrollService from '@/services/scroll/ScrollService';

import styles from './styles.module.scss';

const SCROLL_BLOCK_NEW_MESSAGE_PREFIX = 'SCROLL_BLOCK_message_';
const SCROLL_BLOCK_NEW_MESSAGE_NAME = `${SCROLL_BLOCK_NEW_MESSAGE_PREFIX}newMessage`;

const scrollToMessage = (id, secondOffset = 0, callback = () => {}) => {
  ScrollService.getInstance(CommonScrollbarLocationsConstants.DIALOG_SCROLL)
    .scrollToElement(
      {
        sectionId: `${SCROLL_BLOCK_NEW_MESSAGE_PREFIX}${id}`,
        defaultOffset: true,
        secondOffset,
      },
      callback
    )
    .then();
};

class DialogList extends Component {
  constructor(props) {
    super(props);

    this.scrollRef = createRef();
    this.newMessagesRef = createRef();

    this.scrollHandlerActive = false;
    this.lastScrollTime = null;

    ScrollService.initialize({
      scrollBarName: CommonScrollbarLocationsConstants.DIALOG_SCROLL,
      scrollBarRef: this.scrollRef,
    });

    this.canGetMessagesPrev = false;
    this.canGetMessagesNext = false;

    this.readMessagesIdsLocal = [];

    this.scrollPosition = 0;

    const { registersAddMessageRefCallback, registersDialogListScrollToMessageCallback } = props;

    if (registersAddMessageRefCallback) {
      registersAddMessageRefCallback(this.addMessagesRefs);
    }

    if (registersDialogListScrollToMessageCallback) {
      registersDialogListScrollToMessageCallback(scrollToMessage);
    }

    const { unreadMessages = [] } = props;

    this.state = {
      firstLoadedState: false,
      firstNotReadMessageId: unreadMessages[0] || undefined,
      newMessagesEvent: true,
      shownScrollBottom: false,
    };
  }

  componentDidMount() {
    const { unreadMessages = [], locationUrl, dialogLastMessagesLoadedFromApi } = this.props;

    const { firstNotReadMessageId } = this.state;

    if (firstNotReadMessageId && firstNotReadMessageId >= 0) {
      this.checkUnreadMessages(true);

      unreadMessages.forEach((id) => {
        this.addMessagesRefs(id);
      });

      ScrollService.getInstance(CommonScrollbarLocationsConstants.DIALOG_SCROLL).addSection(
        SCROLL_BLOCK_NEW_MESSAGE_NAME,
        locationUrl,
        this.newMessagesRef
      );

      ScrollService.getInstance(CommonScrollbarLocationsConstants.DIALOG_SCROLL)
        .scrollToElement(
          {
            sectionId: SCROLL_BLOCK_NEW_MESSAGE_NAME,
            defaultOffset: false,
          },
          () => {
            this.canGetMessagesPrev = true;
            this.canGetMessagesNext = true;
            this.setState({ firstLoadedState: true });
          }
        )
        .then();
    } else if (dialogLastMessagesLoadedFromApi) {
      this.scrollFirst();
    }
  }

  componentDidUpdate(prevProps) {
    const {
      unreadMessages = [],
      activeMessagesList,
      searchInDialogIds,
      searchedIdx,
      sendMessageInProcess,
      hasNewMessage = [],
    } = this.props;

    const {
      searchInDialogIds: searchInDialogIdsPrev,
      searchedIdx: searchedIdxPrev,
      sendMessageInProcess: sendMessageInProcessPrev,
      hasNewMessage: hasNewMessagePrev,
      dialogLastMessagesLoadedFromApi: dialogLastMessagesLoadedFromApiPrev,
      activeMessagesList: activeMessagesListPrev = [],
    } = prevProps;

    const { firstNotReadMessageId } = this.state;

    if (
      !dialogLastMessagesLoadedFromApiPrev &&
      activeMessagesList !== activeMessagesListPrev &&
      activeMessagesListPrev.length <= 0 &&
      activeMessagesList.length >= 0 &&
      (!firstNotReadMessageId || firstNotReadMessageId < 0)
    ) {
      this.scrollFirst();
    }

    if (
      (!isEqual(searchInDialogIds, searchInDialogIdsPrev) || searchedIdx !== searchedIdxPrev) &&
      activeMessagesList.length > 0 &&
      searchInDialogIds.length > 0
    ) {
      this.addMessagesRefs(searchInDialogIds[searchedIdx].id);
      scrollToMessage(searchInDialogIds[searchedIdx].id, 350);
    }

    if (sendMessageInProcess !== sendMessageInProcessPrev && !sendMessageInProcess) {
      const { current: { scrollValues: { contentScrollHeight } = {} } = {} } = this.scrollRef;

      this.scrollToBottom(contentScrollHeight);
    }

    if (hasNewMessage !== hasNewMessagePrev && hasNewMessage) {
      if (unreadMessages.length > 0) {
        this.setState({
          firstNotReadMessageId: unreadMessages[0],
        });
        const { current: { scrollValues: { contentScrollHeight: curContentScrollHeight } = {} } = {} } = this.scrollRef;

        if (this.scrollTopCur() >= curContentScrollHeight - this.dialogHeight() && curContentScrollHeight > this.dialogHeight()) {
          const { current: { scrollValues: { contentScrollHeight } = {} } = {} } = this.scrollRef;

          this.scrollToBottom(contentScrollHeight);
        } else {
          this.checkUnreadMessages(true);

          this.setState({
            newMessagesEvent: true,
          });
        }
      } else {
        this.checkUnreadMessages(true);
      }
    }
  }

  componentWillUnmount() {
    this.stopScrollHandler();
  }

  scrollFirst = () => {
    this.setState({
      newMessagesEvent: false,
    });

    setTimeout(() => {
      this.scrollToBottom(
        undefined,
        () => {
          setTimeout(() => {
            this.canGetMessagesPrev = true;
            this.canGetMessagesNext = true;

            this.setState({ firstLoadedState: true });
          }, 300);
        },
        0
      );
    }, 500);
  };

  setReplyMessageId = (messageId) => {
    const { setReplyMessageId } = this.props;

    setReplyMessageId(messageId);
  };

  scrollTopCur = () => {
    const dialogHeight = this.dialogHeight();
    const { current: { scrollValues: { scrollTop } = {} } = {} } = this.scrollRef;

    return scrollTop + dialogHeight;
  };

  dialogHeight = () => {
    const { current: { scrollValues: { clientHeight } = {} } = {} } = this.scrollRef;

    return clientHeight;
  };

  checkUnreadMessages = (withCallback) => {
    const { unreadMessages = [], readMessageStoreAction, location } = this.props;

    if (unreadMessages.length > 0) {
      unreadMessages.forEach((id) => {
        const message = this[`message_${id}_ref`];
        const dialog = this.scrollRef;

        if (message?.current && dialog?.current) {
          const { top: dialogTop, height: dialogHeight } = dialog.current.scrollerElement.getBoundingClientRect();

          const { top: messageTop, height: messageHeight } = message.current.getBoundingClientRect();
          const messageEndY = messageTop - dialogTop + messageHeight;

          if (messageEndY > 0 && messageEndY <= dialogHeight) {
            const findReadMessageId = this.readMessagesIdsLocal.findIndex((readMessageId) => readMessageId === id);

            if (findReadMessageId <= -1) {
              this.readMessagesIdsLocal.push(id);
            }
          }
        }
      });

      if (withCallback && this.readMessagesIdsLocal.length > 0) {
        readMessageStoreAction(location, this.readMessagesIdsLocal);

        this.onReadMessage(this.readMessagesIdsLocal);

        this.readMessagesIdsLocal = [];
      }
    }
  };

  onReadMessage = (readMessagesIdsLocal = []) => {
    const { location, readMessage, chatId, readMessagesIds = [], unreadMessages = [] } = this.props;

    if (readMessagesIdsLocal.length > 0) {
      readMessage(location, chatId, readMessagesIdsLocal).then(() => {
        this.readMessagesIdsLocal = [];

        if (unreadMessages.length <= 0) {
          this.setState({
            firstNotReadMessageId: undefined,
            newMessagesEvent: false,
          });
        }
      });
    } else if (readMessagesIds.length > 0) {
      readMessage(location, chatId, readMessagesIds).then(() => {
        this.readMessagesIdsLocal = [];

        if (unreadMessages.length <= 0) {
          this.setState({
            firstNotReadMessageId: undefined,
            newMessagesEvent: false,
          });
        }
      });
    }
  };

  addMessagesRefs = (id) => {
    const { locationUrl } = this.props;

    ScrollService.getInstance(CommonScrollbarLocationsConstants.DIALOG_SCROLL).addSection(
      `${SCROLL_BLOCK_NEW_MESSAGE_PREFIX}${id}`,
      locationUrl,
      this[`message_${id}_ref`]
    );
  };

  scrollToBottom = (value, callback = () => {}, behavior) => {
    const { current: { scrollValues: { scrollHeight } = {} } = {} } = this.scrollRef || {};

    ScrollService.getInstance(CommonScrollbarLocationsConstants.DIALOG_SCROLL).scrollTo({
      elementTop: value || scrollHeight,
      callback,
      behavior,
    });
  };

  innerRefFunction = (id, ref) => {
    this[`message_${id}_ref`] = ref;
  };

  stopScrollHandler = () => {
    this.scrollHandlerActive = false;
    if (this.scrollHandlerTime) {
      clearInterval(this.scrollHandlerTime);
    }
  };

  startScrollHandler = () => {
    if (this.scrollHandlerActive) {
      return;
    }

    this.scrollHandlerActive = true;

    this.scrollHandlerTime = setInterval(() => {
      const { readMessageStoreAction, location } = this.props;

      if (new Date().valueOf() - this.lastScrollTime > 500) {
        this.stopScrollHandler();
        readMessageStoreAction(location, this.readMessagesIdsLocal);

        this.onReadMessage(this.readMessagesIdsLocal);

        this.readMessagesIdsLocal = [];
      }
    }, 300);
  };

  renderNewMessagesEvent = () => (
    <div className="dialog__new-messages" ref={this.newMessagesRef}>
      New messages
    </div>
  );

  renderMessagesList = () => {
    const { activeMessagesList, searchedText, searchedId, searchInDialogIds, unreadMessages = [], location } = this.props;

    const { firstNotReadMessageId, newMessagesEvent } = this.state;

    return activeMessagesList.map((messageData) => {
      const isSearched = searchInDialogIds.find((searchItem) => searchItem.id === messageData.id);

      return (
        <Fragment key={`dialog-message-${messageData.id}`}>
          <TransitionLayout
            isShown={
              newMessagesEvent &&
              firstNotReadMessageId >= 0 &&
              firstNotReadMessageId === messageData.id &&
              unreadMessages.length > 0
            }
          >
            <>{this.renderNewMessagesEvent()}</>
          </TransitionLayout>
          <DialogMessage
            location={location}
            messageData={{
              ...messageData,
              text: isSearched
                ? messageData.text.replace(searchedText, (match) => `<span class="searched-text">${match}</span>`)
                : messageData.text,
            }}
            innerRefFunction={this.innerRefFunction}
            searchedId={searchedId}
            setReplyMessageId={this.setReplyMessageId}
          />
        </Fragment>
      );
    });
  };

  loadPrevMessages = () => {
    const { activeMessagesList, onGetDialogLastMessages } = this.props;

    const { id } = activeMessagesList[0] || {};
    this.canGetMessagesPrev = false;

    onGetDialogLastMessages({
      messageId: id,
      direction: 'prev',
      setMessagePosition: 'prev',
      callback: () => {
        this.canGetMessagesPrev = true;
      },
    });
  };

  loadNextMessages = () => {
    const { activeMessagesList, onGetDialogLastMessages } = this.props;

    const { id } = activeMessagesList[activeMessagesList.length - 1];
    this.canGetMessagesNext = false;

    onGetDialogLastMessages({
      messageId: id,
      direction: 'next',
      setMessagePosition: 'next',
      callback: () => {
        const { unreadMessages = [] } = this.props;

        this.canGetMessagesNext = true;

        unreadMessages.forEach((idUnreadMessage) => {
          this.addMessagesRefs(idUnreadMessage);
        });
      },
    });
  };

  render() {
    const { inProcess, canPrevMessages, canNextMessages, height, isNotDesktop } = this.props;

    const { firstLoadedState, shownScrollBottom } = this.state;

    return (
      <>
        <Preloader id="dialog-list" isShown={!firstLoadedState} opacity={1} withOffsets={false} />
        <Scrollbar
          ref={this.scrollRef}
          onScroll={() => {
            const { current: { scrollValues: { scrollTop, contentScrollHeight } = {} } = {} } = this.scrollRef;
            const shownScrollBottomButton = contentScrollHeight - this.dialogHeight() > scrollTop + this.dialogHeight();

            if (shownScrollBottomButton !== shownScrollBottom) {
              this.setState({
                shownScrollBottom: shownScrollBottomButton,
              });
            }

            this.startScrollHandler();
            this.checkUnreadMessages();
            this.lastScrollTime = new Date().valueOf();

            if (inProcess) {
              this.scrollPosition = scrollTop;

              return;
            }

            if (
              this.canGetMessagesPrev &&
              canPrevMessages &&
              scrollTop < this.scrollPosition &&
              scrollTop < this.dialogHeight() * 6
            ) {
              this.loadPrevMessages();
            }

            if (
              firstLoadedState &&
              this.canGetMessagesNext &&
              canNextMessages &&
              scrollTop > this.scrollPosition &&
              scrollTop > contentScrollHeight - this.dialogHeight() * 4
            ) {
              this.loadNextMessages();
            }

            this.scrollPosition = scrollTop;
          }}
          style={{
            height: `calc(${height}px - (1rem * ${!isNotDesktop ? 315 + 46 + 20 : 217} / var(--font-size__small-int)))`,
          }}
        >
          <div className={styles.dialog__messages}>
            {!firstLoadedState && false && this.renderNewMessagesEvent()}
            {this.renderMessagesList()}
          </div>
        </Scrollbar>
        <TransitionLayout isShown={shownScrollBottom}>
          <DialogScrollBottomButton
            onClick={() => {
              const { current: { scrollValues: { contentScrollHeight } = {} } = {} } = this.scrollRef;

              this.scrollToBottom(
                contentScrollHeight,
                () => {
                  this.canGetMessagesPrev = true;
                  this.canGetMessagesNext = true;
                },
                0
              );
            }}
          />
        </TransitionLayout>
      </>
    );
  }
}

export default connect(
  () => ({}),
  (dispatch) => ({
    readMessageStoreAction: (location, readMessagesIds) => {
      dispatch(readMessageAction(location, readMessagesIds));
    },
    readMessage: (location, chatId, messageIds) => readMessageRequestAction(location, chatId, messageIds)(dispatch),
  })
)(DialogList);
