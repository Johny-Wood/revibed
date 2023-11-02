import Image from 'next/image';

import SabamLogo from '@/assets/images/global/sabam.png';

import styles from './styles.module.scss';

export default function FooterSabam() {
  return (
    <div className={styles.FooterSabam}>
      <div className={styles.FooterSabam__title}>Licensed by</div>
      <Image src={SabamLogo} alt="sabam" width={128} height={33} />
    </div>
  );
}
