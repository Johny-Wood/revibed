import { MobileLayout } from '@/components/layouts/ViewportLayouts';
import ButtonIcon from '@/components/ui/buttons/ButtonIcon';
import ComponentsCommonConstants from '@/constants/components/common';

import styles from '../../styles.module.scss';

function RetractableMenuButton({ buttonIcon, buttonText, onClick }) {
  return (
    <MobileLayout>
      <ButtonIcon
        className={styles.retractable__button}
        style={{ minWidth: 'auto' }}
        transparent
        size={ComponentsCommonConstants.Size.SMALL35}
        color="gray-3"
        iconPosition="left"
        onClick={onClick}
        text={buttonText}
      >
        {buttonIcon}
      </ButtonIcon>
    </MobileLayout>
  );
}

export default RetractableMenuButton;
