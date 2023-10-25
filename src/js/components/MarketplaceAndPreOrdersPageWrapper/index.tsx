import type { PropsWithChildren } from 'react';

import SiteWrapperLayout from '@/components/layouts/SiteWrapperLayout';
import type { MarketplaceAndPreOrdersSearchExternalProps } from '@/components/MarketplaceAndPreOrdersPageWrapper/_components/MarketplaceAndPreOrdersSearch';
import MarketplaceAndPreOrdersSearch from '@/components/MarketplaceAndPreOrdersPageWrapper/_components/MarketplaceAndPreOrdersSearch';
import MarketplaceAndPreOrdersTabs from '@/components/MarketplaceAndPreOrdersPageWrapper/_components/MarketplaceAndPreOrdersTabs';

type MarketplaceAndPreOrdersPageWrapperProps = PropsWithChildren & MarketplaceAndPreOrdersSearchExternalProps;

const MarketplaceAndPreOrdersPageWrapper = ({
  children,

  ...searchProps
}: MarketplaceAndPreOrdersPageWrapperProps) => (
  <SiteWrapperLayout direction="column" firstInPage>
    <MarketplaceAndPreOrdersTabs />
    <MarketplaceAndPreOrdersSearch {...searchProps} />
    {children}
  </SiteWrapperLayout>
);

export default MarketplaceAndPreOrdersPageWrapper;
