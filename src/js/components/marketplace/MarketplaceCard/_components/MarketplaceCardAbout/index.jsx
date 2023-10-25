import ShowMore from '@/components/common/show-more/ShowMore';
import MarketplaceCardSectionLayout from '@/components/marketplace/MarketplaceCard/_components/MarketplaceCardSectionLayout';

function MarketplaceCardAbout({ description }) {
  return (
    <MarketplaceCardSectionLayout title="About">
      <ShowMore text={description} sliceLength={0} withEmoji />
    </MarketplaceCardSectionLayout>
  );
}

export default MarketplaceCardAbout;
