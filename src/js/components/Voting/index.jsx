import { Component } from 'react';

import isEmpty from 'lodash/isEmpty';
import { connect } from 'react-redux';

import TransitionLayout from '@/components/layouts/TransitionLayouts/TransitionLayout';
import Button from '@/components/ui/buttons/Button';
import ToolTip from '@/components/ui/ToolTip';
import VotingAnswers from '@/components/Voting/_components/VotingAnswers';
import VotingInfo from '@/components/Voting/_components/VotingInfo';
import VotingQuestion from '@/components/Voting/_components/VotingQuestion';
import ComponentsCommonConstants from '@/constants/components/common';
import { showMessageAction } from '@/redux-actions/components/messageActions';
import { loadVotingRequestAction, voteRequestAction } from '@/redux-actions/voting/votingActions';
import { handleErrorUtil } from '@/utils/apiUtils';

import styles from './styles.module.scss';

class Voting extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeAnswerId: null,
      inProcess: false,
    };
  }

  componentDidMount() {
    const { votingId, loadVotingRequest, votingList = {} } = this.props;

    if (!votingList[votingId]) {
      loadVotingRequest({ votingId });
    }
  }

  disabledButtonVote = () => {
    const { activeAnswerId } = this.state;
    const { voteInProcess } = this.props;

    return !activeAnswerId || voteInProcess;
  };

  onVote = () => {
    const { voteRequest, votingId, voteCallback = () => {}, showMessage } = this.props;
    const { activeAnswerId } = this.state;

    if (this.disabledButtonVote()) {
      return;
    }

    this.setState({
      inProcess: true,
    });

    voteRequest({ voteId: activeAnswerId, votingId })
      .then(() => {
        this.setState({
          inProcess: false,
        });
      })
      .catch(({ error = {} }) => {
        this.setState({
          inProcess: false,
        });

        if (error) {
          handleErrorUtil(error, {
            VOTING_ENDED: () => {
              showMessage('ErrorMessage', {
                messageText: 'Voting ended',
              });
            },
            USER_ALREADY_VOTE: () => {
              showMessage('ErrorMessage', {
                messageText: 'You have already voted',
              });
            },
          });
        }
      });

    voteCallback({ activeAnswerId });
  };

  render() {
    const { activeAnswerId, inProcess } = this.state;
    const { votingId, votingList = {} } = this.props;
    const voting = votingList[votingId] || {};
    const { question, answers, votesCount, isEnded, isClosed, endDate, notVoted } = voting;

    if (isEmpty(voting)) {
      return null;
    }

    return (
      <div className={styles.voting}>
        <VotingQuestion question={question} />
        <VotingAnswers
          answers={answers}
          activeAnswerId={activeAnswerId}
          isClosed={isClosed}
          isEnded={isEnded}
          notVoted={notVoted}
          setAnswerCallback={(answerId) => {
            this.setState({
              activeAnswerId: answerId,
            });
          }}
        />
        <TransitionLayout isShown={!isEnded && !isClosed}>
          <div className={styles.voting__control}>
            <Button
              text="Vote"
              size={ComponentsCommonConstants.Size.SMALL30}
              className={styles.voting__buttonVote}
              onClick={() => {
                this.onVote();
              }}
              disabled={this.disabledButtonVote()}
              isInProcess={inProcess}
            />
            <ToolTip color="blue" text="Your vote is equal to your nesting percentage" width={210} position="Y" />
          </div>
        </TransitionLayout>
        <VotingInfo votesCount={votesCount} isEnded={isEnded} endDate={endDate} />
      </div>
    );
  }
}

export default connect(
  (state) => ({
    votingList: state.VotingReducer.votingList,
    voteInProcess: state.VotingReducer.voteInProcess,
  }),
  (dispatch) => ({
    loadVotingRequest: ({ votingId }) => loadVotingRequestAction({ votingId, dispatch }),
    voteRequest: ({ votingId, voteId }) => voteRequestAction({ votingId, voteId })(dispatch),
    showMessage: (messageId, messageData = {}, closeOtherMessages = true) => {
      dispatch(showMessageAction(messageId, messageData, closeOtherMessages));
    },
  })
)(Voting);
