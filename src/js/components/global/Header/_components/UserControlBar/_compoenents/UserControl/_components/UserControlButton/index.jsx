import Button from '@/components/ui/buttons/Button';
import MyAvatar from '@/components/user/MyAvatar';
import ViewportHook from '@/hooks/viewport/ViewportHook';

import styles from './styles.module.scss';

function UserControlButton({ onClick }) {
  const { isNotDesktop } = ViewportHook();

  return (
    <Button className={styles.userControlDropDown} type="button_string" onClick={onClick}>
      <MyAvatar size={isNotDesktop ? 32 : 40} className={styles.userControlDropDown__avatar} />
    </Button>
  );
}

export default UserControlButton;
