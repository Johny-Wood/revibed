import classNames from 'classnames';

import TransitionSwitchLayout from '@/components/layouts/TransitionLayouts/TransitionSwitchLayout';

import styles from './styles.module.scss';

const MAX_COUNT_SHOW = 100;

function NotificationCount({ className, count = 0, withCount = false }) {
  return (
    <TransitionSwitchLayout isShown={count > 0}>
      <span className={classNames([styles.notificationCount, className])}>
        {withCount && <span>{count < MAX_COUNT_SHOW ? count : `+${MAX_COUNT_SHOW - 1}`}</span>}
      </span>
    </TransitionSwitchLayout>
  );
}

export default NotificationCount;
