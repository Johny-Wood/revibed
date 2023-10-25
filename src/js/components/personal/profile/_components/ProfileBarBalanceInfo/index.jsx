import TopUpBalanceButton from '@/components/common-ui/buttons/TopUpBalanceButton';
import UserBalance from '@/components/user/UserBalance';

import styles from './styles.module.scss';

function ProfileBarBalanceInfo() {
  return (
    <div className={styles.profileBarBalance}>
      <UserBalance
        className={styles.userBalance}
        koinClassName={styles.userBalance__koin}
        valueClassName={styles.userBalance__value}
        textSize={20}
        withLabel
      />
      <TopUpBalanceButton transparent={false} className="primary w-100pct m-top-10" />
    </div>
  );
}

export default ProfileBarBalanceInfo;
