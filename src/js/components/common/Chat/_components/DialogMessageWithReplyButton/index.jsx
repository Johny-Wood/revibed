import classNames from 'classnames';

import DialogMessage from '@/components/common/Chat/_components/DialogMessage';
import Button from '@/components/ui/buttons/Button';

import styles from './styles.module.scss';

function DialogMessageWithReplyButton(props) {
  const { deleted, disabled, children, onClick = () => {} } = props;

  return (
    <div className={classNames(styles.dialogMessageComment, 'w-100pct ')}>
      <DialogMessage {...props} />
      <div className={styles.dialogMessage__replayControl}>
        {!disabled && !deleted && (
          <Button
            className={classNames(styles.buttonReply, 't-medium c-gray-1 t-size_12')}
            text="REPLY"
            type="button_string"
            onClick={() => {
              onClick();
            }}
          />
        )}
        {children}
      </div>
    </div>
  );
}

export default DialogMessageWithReplyButton;
