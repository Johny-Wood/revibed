import BackButton from '@/components/common-ui/buttons/BackButton';
import { RoutePathsConstants } from '@/constants/routes/routes';

import styles from './styles.module.scss';

function ReleaseBackButton() {
  return (
    <div className={styles.releaseBackButton}>
      <BackButton hrefDefault={RoutePathsConstants.WANTLIST} />
    </div>
  );
}

export default ReleaseBackButton;
