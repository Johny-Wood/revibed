import classNames from 'classnames';

import styles from './styles.module.scss';

function AccountNotificationsSettingsWrapperLayout({ className, children }) {
  return <div className={classNames([styles.accountNotificationsSettingsWrapper, className])}>{children}</div>;
}

export default AccountNotificationsSettingsWrapperLayout;
