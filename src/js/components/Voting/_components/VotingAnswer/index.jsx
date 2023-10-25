import classNames from 'classnames';
import PropTypes from 'prop-types';

import TransitionLayout from '@/components/layouts/TransitionLayouts/TransitionLayout';
import RadioButton from '@/components/ui/inputs/RadioButton';
import VotingProgressBar from '@/components/Voting/_components/VotingProgressBar';
import CheckedBlueIcon from '@/icons/project/events/CheckedBlueIcon';

import styles from './styles.module.scss';

function VotingAnswer({
  checked,
  isClosed,
  isEnded,
  notVoted: { pct: notVotedPtc } = {},
  answer: { id, text = '', votesPct = 0, pct = 0, isNotVoted, defaultWin, myVote, isWin } = {},
  setAnswerCallback,
}) {
  const votingFinished = isClosed || isEnded;
  const voteValue = defaultWin && votingFinished && notVotedPtc === 100 ? 100 : votesPct || pct;

  return (
    <div
      className={classNames(
        styles.votingAnswer,
        votingFinished && styles.votingAnswer_closed,
        isNotVoted && styles.votingAnswer_not_voted
      )}
    >
      <div className={styles.votingAnswer__results__pct}>
        {!isClosed && !isEnded && (
          <RadioButton
            id={id}
            checked={checked}
            rounded
            onChange={() => {
              setAnswerCallback(id);
            }}
            isBlue
            className={styles.radioButtonBlock}
            radioClassName={styles.radioButton}
            textClassName={styles.radioButton__text}
            okClassName={styles.radioButton__ok}
            okCheckClassName={styles.radioButton__ok_check}
          />
        )}
        <TransitionLayout isShown={votingFinished} duration={300}>
          <div>
            {voteValue}%
            {myVote && (
              <div className={styles.votingAnswer_my}>
                <CheckedBlueIcon />
              </div>
            )}
          </div>
        </TransitionLayout>
      </div>
      <div className={styles.votingAnswer__results}>
        <label htmlFor={id} className={styles.votingAnswer__text}>
          {text}
          <VotingProgressBar isNotVoted={isNotVoted} votesPct={voteValue} isShown={votingFinished || myVote} isWin={isWin} />
        </label>
      </div>
    </div>
  );
}

VotingAnswer.defaultProps = {
  checked: false,
  isClosed: false,
  isEnded: false,
  setAnswerCallback: () => {},
};

VotingAnswer.propTypes = {
  checked: PropTypes.bool,
  isClosed: PropTypes.bool,
  isEnded: PropTypes.bool,
  setAnswerCallback: PropTypes.func,
};

export default VotingAnswer;
