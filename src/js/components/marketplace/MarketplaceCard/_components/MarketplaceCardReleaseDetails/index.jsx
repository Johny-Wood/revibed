import MarketplaceCardSectionLayout from '@/components/marketplace/MarketplaceCard/_components/MarketplaceCardSectionLayout';
import ProjectCardReleaseDetails from '@/components/project/ProjectCard/info-details/ProjectCardReleaseDetails';

import styles from './styles.module.scss';

function MarketplaceCardReleaseDetails({ releaseDetails }) {
  return (
    <MarketplaceCardSectionLayout title="Release details" className={styles.marketplaceCardReleaseDetails}>
      <ProjectCardReleaseDetails
        className={styles.marketplaceCardReleaseDetails__projectCardDetails}
        releaseDetails={releaseDetails}
        items={['released', 'country', 'format', 'label']}
      />
    </MarketplaceCardSectionLayout>
  );
}

export default MarketplaceCardReleaseDetails;
