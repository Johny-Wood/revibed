import { Component } from 'react';

import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import TransitionSwitchLayout from '@/components/layouts/TransitionLayouts/TransitionSwitchLayout';
import { deleteTypingParticipantAction } from '@/redux-actions/dialog/dialogActions';

import styles from './styles.module.scss';

const SHOWN_NICKNAMES = 2;
const TYPING_DURATION = 4000;

class DialogTyping extends Component {
  constructor(props) {
    super(props);

    this.timers = {};
  }

  componentDidMount() {
    this.startTimers();
  }

  componentDidUpdate(prevProps) {
    const { participantsTyping } = this.props;
    const { participantsTyping: participantsTypingPrev } = prevProps;

    const cloneParticipantsTyping = cloneDeep(participantsTyping);
    const cloneParticipantsTypingPrev = cloneDeep(participantsTypingPrev);

    if (!isEqual(cloneParticipantsTyping, cloneParticipantsTypingPrev)) {
      const participantsTypingIds = Object.keys(cloneParticipantsTyping);
      const participantsTypingIdsForUpdate = [];

      participantsTypingIds.forEach((participantsTypingId) => {
        if (cloneParticipantsTyping[participantsTypingId] !== cloneParticipantsTypingPrev[participantsTypingId]) {
          participantsTypingIdsForUpdate.push(participantsTypingId);
        }
      });

      participantsTypingIdsForUpdate.forEach((participantsTypingId) => {
        this.stopTimer(participantsTypingId);
        this.startTimer(participantsTypingId);
      });
    }
  }

  componentWillUnmount() {
    this.stopTimers();
  }

  startTimer = (timer) => {
    const { location, deleteTypingParticipant } = this.props;

    this.timers[`${timer}`] = setInterval(() => {
      deleteTypingParticipant(location, timer);

      this.stopTimer(timer);
    }, TYPING_DURATION);
  };

  stopTimer = (timer) => {
    clearInterval(this.timers[`${timer}`]);
  };

  startTimers = () => {
    const { participantsTyping } = this.props;

    Object.keys(participantsTyping).forEach((timer) => {
      this.startTimer(timer);
    });
  };

  stopTimers = () => {
    Object.keys(this.timers).forEach((timer) => {
      this.stopTimer(timer);
    });
  };

  render() {
    const { participantsTyping, dialogInfo: { participants: participantsList = [] } = {} } = this.props;

    const participantsTypingIds = Object.keys(participantsTyping);
    const participantsTypingArray = participantsTypingIds
      .map((participantTypingId) => participantsList.find(({ id }) => id === +participantTypingId))
      .filter((id) => id !== undefined);
    const participantsTypingList = cloneDeep(participantsTypingArray).splice(0, SHOWN_NICKNAMES);
    const participantsTypingListMore = cloneDeep(participantsTypingArray).slice(SHOWN_NICKNAMES);

    return (
      <TransitionSwitchLayout isShown={participantsTypingArray.length > 0}>
        <div className={styles.dialogTyping}>
          {participantsTypingList.map(({ name }, idx) => (
            <span key={`dialog-typing-${name}`}>
              <span className="t-medium">{name}</span>
              {idx !== participantsTypingList.length - 1 && <>,&nbsp;</>}
            </span>
          ))}
          {participantsTypingListMore.length > 0 && (
            <>
              &nbsp;and&nbsp;
              {participantsTypingListMore.length}
            </>
          )}
          &nbsp;Typing&nbsp;
          <span className={styles.dialogTyping__point}>.</span>
          <span className={styles.dialogTyping__point}>.</span>
          <span className={styles.dialogTyping__point}>.</span>
        </div>
      </TransitionSwitchLayout>
    );
  }
}

DialogTyping.defaultProps = {
  participantsTyping: {},
  dialogInfo: {},
};

DialogTyping.propTypes = {
  participantsTyping: PropTypes.object,
  dialogInfo: PropTypes.object,
};

export default connect(
  () => ({}),
  (dispatch) => ({
    deleteTypingParticipant: (location, participantId) => {
      dispatch(deleteTypingParticipantAction(location, participantId));
    },
  })
)(DialogTyping);
