import classNames from 'classnames';

import AccountNotificationsSettingsEmail from '@/components/personal/settings/notifications/AccountNotificationsSettingsEmail';

import styles from './styles.module.scss';

function FullUnsubscribeWrapper({ token, template }) {
  return (
    <div className={styles.fullUnsubscribe}>
      <div className={classNames([styles.fullUnsubscribe__info, 't-size_16'])}>
        <b>
          You have successfully
          <br />
          unsubscribed from
        </b>
        <p>Voting started</p>
      </div>
      <AccountNotificationsSettingsEmail
        className={styles.fullUnsubscribe__accountNotificationsSettingsWrapper}
        accountNotificationsSettingsTableClassName={styles.fullUnsubscribe__accountNotificationsSettings}
        token={token}
        template={template}
      />
    </div>
  );
}

export default FullUnsubscribeWrapper;
