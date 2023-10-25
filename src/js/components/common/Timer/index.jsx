import { Component } from 'react';

import classNames from 'classnames';

import { getDateFormatUtil } from '@/utils/dateUtils';

import styles from './styles.module.scss';

const computedTimeValueLength = (value) => {
  const valueLength = `${value}`.length;

  return valueLength > 1 ? valueLength : 2;
};

class Timer extends Component {
  constructor(props) {
    super(props);

    const { endDate } = props;

    this.timerIntervalId = undefined;

    this.state = {
      deadlineDate: endDate || new Date().valueOf(),
      seconds: '00',
      minutes: '00',
      hours: '00',
      days: '00',
    };
  }

  componentDidMount() {
    this.initializeClock();
  }

  componentDidUpdate(prevProps) {
    const { endDate } = this.props;
    const { endDate: endDatePrev } = prevProps;

    if (endDate !== endDatePrev) {
      this.destroyClock();
      this.updateEndDate();
    }
  }

  componentWillUnmount() {
    this.destroyClock();
  }

  updateEndDate = () => {
    const { endDate } = this.props;
    this.setState(
      {
        deadlineDate: endDate || new Date().valueOf(),
      },
      () => {
        this.initializeClock();
      }
    );
  };

  getTimeRemaining = () => {
    const { deadlineDate } = this.state;
    const { formats = ['days', 'hours', 'minutes', 'seconds'] } = this.props;

    const hasDays = formats.includes('days');
    const total = deadlineDate - new Date();

    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor(hasDays ? (total / (1000 * 60 * 60)) % 24 : total / (1000 * 60 * 60));
    const days = Math.floor(total / (1000 * 60 * 60 * 24));

    return {
      total,
      days,
      hours,
      minutes,
      seconds,
    };
  };

  updateClock = () => {
    const { endDateCallback = () => {} } = this.props;

    const { total, days, hours, minutes, seconds } = this.getTimeRemaining();

    if (total <= 1000) {
      if (this.timerIntervalId) {
        this.destroyClock();
        endDateCallback();
      }
    } else {
      this.setState({
        days: `0${days}`.slice(-computedTimeValueLength(days)),
        hours: `0${hours}`.slice(-computedTimeValueLength(hours)),
        minutes: `0${minutes}`.slice(-computedTimeValueLength(minutes)),
        seconds: `0${seconds}`.slice(-computedTimeValueLength(seconds)),
      });
    }
  };

  initializeClock = () => {
    this.updateClock();

    this.timerIntervalId = setInterval(() => {
      this.updateClock();
    }, 1000);
  };

  destroyClock = () => {
    clearInterval(this.timerIntervalId);
  };

  render() {
    const { days, hours, minutes, seconds } = this.state;

    const {
      endDate,
      formats = ['days', 'hours', 'minutes', 'seconds'],
      className,
      separatorClassName,
      valueClassName,
    } = this.props;

    const hasDays = formats.includes('days');
    const hasHours = formats.includes('hours');
    const hasMinutes = formats.includes('minutes');
    const hasSeconds = formats.includes('seconds');

    const valueWidthDays = `${computedTimeValueLength(days)}ch`;
    const valueWidthHours = `${computedTimeValueLength(hours)}ch`;
    const valueWidthMinutes = `${computedTimeValueLength(minutes)}ch`;
    const valueWidthSeconds = `${computedTimeValueLength(seconds)}ch`;

    return (
      <span className={classNames([styles.timer, className])} title={getDateFormatUtil(endDate)}>
        {hasDays && (
          <>
            <span className={classNames([styles.timer__value, valueClassName])} style={{ width: valueWidthDays }}>
              {days}
            </span>
            <span className={classNames([styles.timer__separator, separatorClassName])}>:</span>
          </>
        )}
        {hasHours && (
          <>
            <span className={classNames([styles.timer__value, valueClassName])} style={{ width: valueWidthHours }}>
              {hours}
            </span>
            <span className={classNames([styles.timer__separator, separatorClassName])}>:</span>
          </>
        )}
        {hasMinutes && (
          <>
            <span className={classNames([styles.timer__value, valueClassName])} style={{ width: valueWidthMinutes }}>
              {minutes}
            </span>
            <span className={classNames([styles.timer__separator, separatorClassName])}>:</span>
          </>
        )}
        {hasSeconds && (
          <span
            className={classNames([styles.timer__value, styles.timer__seconds, valueClassName])}
            style={{ width: valueWidthSeconds }}
          >
            {seconds}
          </span>
        )}
      </span>
    );
  }
}

export default Timer;
