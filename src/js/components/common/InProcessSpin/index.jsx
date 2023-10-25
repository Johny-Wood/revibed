import SpinIcon from '@/icons/SpinIcon';

import styles from './styles.module.scss';

function InProcessSpin({ color }) {
  return (
    <div className={styles.inProcess}>
      <SpinIcon color={color} />
    </div>
  );
}

export default InProcessSpin;
