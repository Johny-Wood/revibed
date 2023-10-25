import { useEffect, useState } from 'react';

import BackButton from '@/components/common-ui/buttons/BackButton';
import MarketplaceCardAbout from '@/components/marketplace/MarketplaceCard/_components/MarketplaceCardAbout';
import MarketplaceCardInfo from '@/components/marketplace/MarketplaceCard/_components/MarketplaceCardInfo';
import MarketplaceCardReleaseDetails from '@/components/marketplace/MarketplaceCard/_components/MarketplaceCardReleaseDetails';
import MarketplaceCardTracks from '@/components/marketplace/MarketplaceCard/_components/MarketplaceCardTracks';
import { RoutePathsConstants } from '@/constants/routes/routes';
import NextRouter from '@/services/NextRouter';

import styles from './styles.module.scss';

function MarketplaceCard({ info }) {
  const { id, description, release } = info || {};

  const [activeTrackId, setActiveTrackId] = useState(-1);

  useEffect(() => {
    const { router: { router: { query } = {} } = {} } = NextRouter.getInstance();

    if (!query.track) {
      return;
    }

    setActiveTrackId(+query.track);
  }, []);

  return (
    <div className={styles.marketplaceCard}>
      <BackButton hrefDefault={RoutePathsConstants.MARKETPLACE} />
      <MarketplaceCardInfo info={info} marketplaceCardId={id} />
      <MarketplaceCardTracks info={info} marketplaceCardId={id} activeTrackId={activeTrackId} />
      {!!description && <MarketplaceCardAbout description={description} />}
      <MarketplaceCardReleaseDetails releaseDetails={release} />
    </div>
  );
}

export default MarketplaceCard;
