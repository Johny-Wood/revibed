import classNames from 'classnames';

import RenewableDate from '@/components/common/date/RenewableDate';

import styles from './styles.module.scss';

function ProjectTime({ className, leftTimeClassName, isOpenStatus, isLastCallStatus, startDate, closeDate, withDescriptions }) {
  const isLeftDate = closeDate && (isOpenStatus || isLastCallStatus);
  const isLeftDateLastCall = closeDate && isLastCallStatus;
  const isLeftDateLastOpen = closeDate && isOpenStatus;

  let color = 'c-gray-3';

  if (isLeftDateLastCall) {
    color = 'LAST_CALL';
  } else if (isLeftDateLastOpen) {
    color = 'c-gray-3';
  }

  return (
    <div className={classNames([styles.projectTime, className])}>
      <div />
      <RenewableDate
        className={leftTimeClassName}
        date={isLeftDate ? closeDate : startDate}
        withDescriptions={withDescriptions}
        direction={isLeftDate ? 'LEFT' : 'AGO'}
        color={color}
        isTimer={isLeftDateLastCall}
      />
    </div>
  );
}

export default ProjectTime;
