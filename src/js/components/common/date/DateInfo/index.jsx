import { useEffect, useMemo, useState } from 'react';

import classNames from 'classnames';

import Timer from '@/components/common/Timer';
import TimeIcon from '@/icons/TimeIcon';
import {
  getDateFormatUtil,
  normalizeDateUtilAgoUtil,
  normalizeDateUtilLeftUtil,
  normalizeDateWithTimeUtil,
} from '@/utils/dateUtils';

import styles from './styles.module.scss';

const renderDescription = ({ direction }) => {
  if (direction === 'AGO') {
    return <>&nbsp;created</>;
  }

  return <>&nbsp;left</>;
};

const getDateFormat = ({ direction, withNormalizeDateWithTime, date, leftDate, withCurrentDatePoint }) => {
  if (withNormalizeDateWithTime) {
    return normalizeDateWithTimeUtil(date);
  }

  if (direction === 'AGO') {
    return normalizeDateUtilAgoUtil(date);
  }

  return normalizeDateUtilLeftUtil(date, leftDate, withCurrentDatePoint);
};

const getDateTitle = ({ date }) => getDateFormatUtil(date);

function DateInfo({
  date: dateProps = 0,
  leftDate = 0,
  withIcon,
  color,
  isTimer,
  withDescriptions,
  direction,
  withNormalizeDateWithTime,
  withCurrentDatePoint,
  triggerUpdateDateFormatted,
  triggerUpdateDateTitle,
  className,
}) {
  const date = useMemo(() => dateProps + leftDate, [dateProps, leftDate]);

  const [dateFormatted, setDateFormatted] = useState();
  const [dateTitle, setDateTitle] = useState();

  useEffect(() => {
    setDateFormatted(
      getDateFormat({
        direction,
        withNormalizeDateWithTime,
        date,
        leftDate,
        withCurrentDatePoint,
      })
    );

    setDateTitle(getDateTitle({ date }));
  }, [date, direction, leftDate, withCurrentDatePoint, withNormalizeDateWithTime]);

  useEffect(() => {
    setDateFormatted(
      getDateFormat({
        direction,
        withNormalizeDateWithTime,
        date,
        leftDate,
        withCurrentDatePoint,
      })
    );
  }, [date, direction, leftDate, triggerUpdateDateFormatted, withCurrentDatePoint, withNormalizeDateWithTime]);

  useEffect(() => {
    setDateTitle(getDateTitle({ date }));
  }, [date, triggerUpdateDateTitle]);

  if (!date) {
    return null;
  }

  return (
    <span className={classNames([styles.projectLifeTime, 'f-y-center', className])} title={dateTitle}>
      {withIcon && <TimeIcon color={color.replace('c-', '')} />}
      <span>
        {!isTimer ? (
          dateFormatted
        ) : (
          <Timer
            separatorClassName={styles.timer__separator}
            valueClassName={styles.timer__value}
            formats={['hours', 'minutes', 'seconds']}
            endDate={date}
          />
        )}
      </span>
      {withDescriptions && <span className="c-gray-3">{renderDescription({ direction })}</span>}
    </span>
  );
}

export default DateInfo;
