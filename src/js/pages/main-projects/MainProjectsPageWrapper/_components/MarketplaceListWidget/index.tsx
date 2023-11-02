import classNames from 'classnames';

import MarketplaceListComingSoon from '@/pages/main-projects/MainProjectsPageWrapper/_components/MarketplaceListWidget/_components/MarketplaceListComingSoon';
import MarketplaceListNewReleases from '@/pages/main-projects/MainProjectsPageWrapper/_components/MarketplaceListWidget/_components/MarketplaceListNewReleases';

import styles from './styles.module.scss';

function MarketplaceListWidget() {
  return (
    <div className={classNames(styles.MarketplaceList)}>
      <MarketplaceListNewReleases />
      <MarketplaceListComingSoon />
    </div>
  );
}

export default MarketplaceListWidget;
