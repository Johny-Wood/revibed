import CheckedGreenIcon from '@/icons/project/events/CheckedGreenIcon';

import styles from './styles.module.scss';

function ActivatedMessage() {
  return (
    <div className={styles.blackCatCardActivatedMessage}>
      <CheckedGreenIcon color="#009444" />
      <span className={styles.blackCatCardActivatedMessage__text}>
        Promo code redeemed. <br />
        Bonus Koins added.
      </span>
    </div>
  );
}

export default ActivatedMessage;
