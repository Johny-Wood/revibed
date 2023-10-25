import classNames from 'classnames';
import PropTypes from 'prop-types';

import styles from './styles.module.scss';

function VotingProgressBar({ votesPct, isNotVoted, isWin, isShown }) {
  return (
    <div className={classNames(styles.votingProgressBar, isShown && styles.votingProgressBar_shown)}>
      <div
        className={classNames(
          styles.votingProgressBar__value,
          isNotVoted && styles.votingProgressBar__value_not_voted,
          isWin && styles.votingProgressBar__value_win
        )}
        style={{ width: `${votesPct}%` }}
      />
    </div>
  );
}

VotingProgressBar.defaultProps = {
  votesPct: 0,
  isShown: true,
  isWin: false,
  isNotVoted: false,
};

VotingProgressBar.propTypes = {
  votesPct: PropTypes.number,
  isShown: PropTypes.bool,
  isWin: PropTypes.bool,
  isNotVoted: PropTypes.bool,
};

export default VotingProgressBar;
