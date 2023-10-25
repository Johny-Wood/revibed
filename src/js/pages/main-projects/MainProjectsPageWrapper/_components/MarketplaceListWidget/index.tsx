import classNames from 'classnames';

import SecondaryTitle from '@/components/common/titles/SecondaryTitle';
import MarketplaceTabs from '@/pages/main-projects/MainProjectsPageWrapper/_components/MarketplaceListWidget/_components/MarketplaceTabs';

import styles from './styles.module.scss';

function MarketplaceListWidget() {
  return (
    <div className={classNames(styles.MarketplaceList)}>
      <SecondaryTitle title="Marketplace" />
      <MarketplaceTabs />
    </div>
  );
}

export default MarketplaceListWidget;
