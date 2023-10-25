import classNames from 'classnames';

import styles from './styles.module.scss';

function NotificationEventContent({ className, title, text, children, component, eventClassName }) {
  if (component) {
    return component;
  }

  return (
    <span className={classNames([styles.notificationEvent__event, className, eventClassName])}>
      {!!title && (
        <>
          <b>{title}</b>
          <br />
        </>
      )}
      {!!text && text}
      {children}
    </span>
  );
}

export default NotificationEventContent;
