import classNames from 'classnames';

import RenewableDate from '@/components/common/date/RenewableDate';
import Timer from '@/components/common/Timer';
import TransitionLayout from '@/components/layouts/TransitionLayouts/TransitionLayout';
import TimerIcon from '@/icons/TimerIcon';

import styles from './styles.module.scss';

function VotingInfo({ isEnded, votesCount, endDate }) {
  return (
    <div className={styles.votingInfo}>
      <div>
        {!isEnded && (
          <div className={styles.votingInfoProcess}>
            <span className={styles.votingInfoProcess__type}>in progress:</span>
            <TimerIcon />
            <span className={styles.votingInfoProcess__value}>
              <Timer className={styles.timer} endDate={endDate} />
            </span>
          </div>
        )}
        <TransitionLayout isShown={isEnded}>
          <div className={styles.votingInfoProcess}>
            <span className={classNames(styles.votingInfoProcess__over, 'c-gray-3')}>voting in over:</span>
            <RenewableDate
              className={styles.projectLifeTime}
              date={endDate}
              withDescriptions={false}
              withIcon={false}
              withNormalizeDateWithTime
            />
          </div>
        </TransitionLayout>
      </div>
      <div className={styles.votingInfo__voted}>{votesCount} voted</div>
    </div>
  );
}

export default VotingInfo;
