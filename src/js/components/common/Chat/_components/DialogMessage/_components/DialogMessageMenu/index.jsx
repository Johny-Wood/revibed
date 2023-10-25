import classNames from 'classnames';

import TransitionLayout from '@/components/layouts/TransitionLayouts/TransitionLayout';
import Button from '@/components/ui/buttons/Button';
import ComponentsCommonConstants from '@/constants/components/common';

import styles from './styles.module.scss';

function DialogMessageMenu({ className, isShow, closeMenuCallback = () => {}, replyCallback = () => {} }) {
  return (
    <TransitionLayout isShown={isShow}>
      <div
        className={classNames(styles.dialogMessageContext, className)}
        onMouseLeave={() => {
          closeMenuCallback();
        }}
        onBlur={() => {
          closeMenuCallback();
        }}
      >
        <Button
          text="reply"
          size={ComponentsCommonConstants.Size.SMALL}
          onClick={() => {
            replyCallback();
            closeMenuCallback();
          }}
        />
      </div>
    </TransitionLayout>
  );
}

export default DialogMessageMenu;
