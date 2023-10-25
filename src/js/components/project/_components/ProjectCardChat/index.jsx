import { Component, createRef } from 'react';

import { connect } from 'react-redux';

import Comments from '@/components/common/Chat/Comments';
import { CommonScrollbarLocationsConstants } from '@/constants/common/scrollBar';
import DialogLocationsConstants from '@/constants/dialog/location';
import ScrollBlockIdConstants from '@/constants/scroll/scrollBlockId';
import { getDialogLastMessagesRequestAction } from '@/redux-actions/dialog/dialogActions';
import { transformToProjectCommentsAction } from '@/redux-actions/project/projectCardActions';
import { withPrivateAuthRoute } from '@/services/auth/WithPrivateAuthRoute';
import ScrollService from '@/services/scroll/ScrollService';
import { createProjectUrlUtil } from '@/utils/project/projectUrlUtil';

import styles from './styles.module.scss';

class ProjectCardChat extends Component {
  constructor(props) {
    super(props);
    const { dialogLastMessagesLoadedFromApi } = props;

    this.scrollRef = createRef();

    this.state = {
      firstLoaded: dialogLastMessagesLoadedFromApi || false,
    };
  }

  componentDidMount() {
    this.onGetDialogLastMessagesCallback({ callback: this.scrollToSection });
  }

  componentDidUpdate(prevProps) {
    const { dialogIdLoadedFromApi } = this.props;
    const { dialogIdLoadedFromApi: dialogIdLoadedFromApiPrev } = prevProps;

    if (dialogIdLoadedFromApi !== dialogIdLoadedFromApiPrev && dialogIdLoadedFromApi) {
      this.onGetDialogLastMessagesCallback();
    }
  }

  componentWillUnmount() {
    const { projectCardId, counterMessages, transformToProjectComments } = this.props;

    const commentsInfo = {
      commentsCount: counterMessages,
    };

    transformToProjectComments({
      projectCardId,
      commentsInfo,
    });
  }

  scrollToSection = () => {
    const { projectCardId, title, canScrollToComment, setCanScrollToComment } = this.props;

    if (!canScrollToComment) {
      return;
    }

    ScrollService.getInstance(CommonScrollbarLocationsConstants.MAIN_SCROLL).addSection(
      ScrollBlockIdConstants.PROJECT_COMMENTS,
      createProjectUrlUtil(projectCardId, title),
      this.scrollRef
    );

    ScrollService.getInstance(CommonScrollbarLocationsConstants.MAIN_SCROLL)
      .scrollToElement({
        sectionId: ScrollBlockIdConstants.PROJECT_COMMENTS,
        inRoute: true,
        secondOffset: 300,
      })
      .then(() => {
        setCanScrollToComment();
      });
  };

  onGetDialogLastMessagesCallback = ({ callback }) => {
    const { dialogLastMessagesLoadedFromApi } = this.props;

    if (!dialogLastMessagesLoadedFromApi) {
      this.onGetDialogLastMessages({
        callback: () => {
          if (callback) {
            callback();
          }
          this.setState({ firstLoaded: true });
        },
      });
    } else if (callback) {
      callback();
    }
  };

  onGetDialogLastMessages = ({ messageId, parentId, setMessagePosition = 'next', direction = 'next', callback = () => {} }) => {
    const { commentsInfo: { commentsChatId: chatId } = {}, getDialogLastMessages } = this.props;

    getDialogLastMessages({
      location: DialogLocationsConstants.PROJECT,
      chatId,
      messageId,
      direction,
      parentId,
      setMessagePosition,
    }).then(() => callback());
  };

  render() {
    const { firstLoaded } = this.state;
    const {
      commentsInfo,
      messages,
      getDialogLastMessagesInProcess,
      canPrevMessages,
      counterMessages,
      sendMessageInProcess,
      disabled,
    } = this.props;

    return (
      <div className={styles.projectCardChat} ref={this.scrollRef}>
        <Comments
          commentsInfo={{
            ...commentsInfo,
            commentsCount: counterMessages,
          }}
          disabled={disabled}
          firstLoaded={firstLoaded}
          activeMessagesList={messages}
          inProcess={getDialogLastMessagesInProcess}
          sendMessageInProcess={sendMessageInProcess}
          onGetDialogLastMessages={this.onGetDialogLastMessages}
          location={DialogLocationsConstants.PROJECT}
          canPrevMessages={canPrevMessages}
        />
      </div>
    );
  }
}

export default connect(
  (state) => ({
    dialogLastMessagesLoadedFromApi: state.ProjectCommentsReducer.dialogLastMessagesLoadedFromApi,
    dialogIdLoadedFromApi: state.ProjectCommentsReducer.dialogIdLoadedFromApi,
    getDialogLastMessagesInProcess: state.ProjectCommentsReducer.getDialogLastMessagesInProcess,
    messages: state.ProjectCommentsReducer.messages,
    sendMessageInProcess: state.ProjectCommentsReducer.sendMessageInProcess,
    canPrevMessages: state.ProjectCommentsReducer.canPrevMessages,
    counterMessages: state.ProjectCommentsReducer.counterMessages,
  }),
  (dispatch) => ({
    getDialogLastMessages: (params) => getDialogLastMessagesRequestAction(params)(dispatch),
    transformToProjectComments: ({ projectCardId, commentsInfo }) => {
      dispatch(
        transformToProjectCommentsAction({
          projectCardId,
          commentsInfo,
        })
      );
    },
  })
)(withPrivateAuthRoute(ProjectCardChat));
