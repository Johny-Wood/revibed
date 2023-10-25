import { useEffect, useRef } from 'react';

import classNames from 'classnames';
import parse from 'html-react-parser';
import { connect } from 'react-redux';

import Button from '@/components/ui/buttons/Button';
import TranslateHook from '@/hooks/translate/TranslateHook';
import CloseIcon from '@/icons/control/close/CloseIcon';
import { closeMessageAction } from '@/redux-actions/components/messageActions';

import styles from './styles.module.scss';

const SystemMessage = ({
  messageId,
  messageStatus = 'default',
  messageData: { messageText = '', textTranslateKey, autoClose = true } = {},
  closeMessage,
}) => {
  const t = TranslateHook();

  const timer = useRef(null);

  useEffect(() => {
    if (autoClose) {
      timer.current = setTimeout(() => {
        closeMessage();
      }, 10000);
    }
  }, [autoClose, closeMessage]);

  useEffect(
    () => () => {
      if (autoClose) {
        clearTimeout(timer.current);
      }
    },
    [autoClose]
  );

  return (
    <div
      className={classNames(
        styles.systemMessage,
        messageStatus === 'default' && styles.systemMessage_default,
        messageStatus === 'error' && styles.systemMessage_error,
        messageStatus === 'success' && styles.systemMessage_success,
        messageStatus === 'information' && styles.systemMessage_information,
        'system-message',
        messageId
      )}
    >
      <div className={classNames(styles.systemMessage__content, 'system-message__content')}>
        <div className={styles.systemMessage__wrapper}>
          <Button type="button_string" className={styles.systemMessage__close} onClick={() => closeMessage(messageId)}>
            <CloseIcon />
          </Button>
          <p className={styles.systemMessage__text}>{parse(messageText || t(textTranslateKey || ''))}</p>
        </div>
      </div>
    </div>
  );
};

export default connect(
  () => ({}),
  (dispatch) => ({
    closeMessage: (messageId) => {
      dispatch(closeMessageAction(messageId));
    },
  })
)(SystemMessage);
