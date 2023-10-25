import ButtonIcon from '@/components/ui/buttons/ButtonIcon';
import ArrowIcon from '@/icons/arrows/ArrowIcon';

import styles from './styles.module.scss';

function DialogScrollBottomButton({ onClick }) {
  return (
    <ButtonIcon
      icon={ArrowIcon}
      iconColor="var(--color__black)"
      rounded
      transparent
      className={styles.dialogScrollBottomButton}
      onClick={onClick}
    />
  );
}

export default DialogScrollBottomButton;
