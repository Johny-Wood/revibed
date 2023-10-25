import classNames from 'classnames';

import styles from './styles.module.scss';

function TelegramBotConnectIndication({ connected }) {
  return (
    <div className={classNames(styles.telegramBotConnectIndication, connected && styles.telegramBotConnectIndication_connected)}>
      <span className={styles.telegramBotConnectIndication__status} />
      <span>{connected ? 'Connected' : 'Not connected'}</span>
    </div>
  );
}

export default TelegramBotConnectIndication;
