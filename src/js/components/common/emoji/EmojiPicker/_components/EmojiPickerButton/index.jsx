import ButtonIcon from '@/components/ui/buttons/ButtonIcon';
import SmileIcon from '@/icons/dialog/SmileIcon';

import styles from './styles.module.scss';

function EmojiPickerButton({ onClick }) {
  return <ButtonIcon icon={SmileIcon} type="button_string" className={styles.emojiPickerButton} onClick={onClick} />;
}

export default EmojiPickerButton;
