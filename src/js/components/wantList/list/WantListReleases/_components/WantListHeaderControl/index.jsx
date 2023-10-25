import { DesktopLayout } from '@/components/layouts/ViewportLayouts';
import WantListReleasesControl from '@/components/wantList/list/WantListReleases/_components/WantListReleasesControl';

import styles from './styles.module.scss';

function WantListHeaderControl() {
  return (
    <DesktopLayout>
      <div className={styles.wantListHeaderControl}>
        <WantListReleasesControl />
      </div>
    </DesktopLayout>
  );
}

export default WantListHeaderControl;
