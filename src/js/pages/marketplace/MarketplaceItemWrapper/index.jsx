import { useMemo } from 'react';

import { connect } from 'react-redux';

import BaseWebsiteLayout from '@/components/layouts/BaseWebsiteLayout';
import PageDisabledLayout from '@/components/layouts/PageDisabledLayout';
import SiteWrapperLayout from '@/components/layouts/SiteWrapperLayout';
import WrapperContainerLayout from '@/components/layouts/WrapperContainerLayout';
import MarketplaceCard from '@/components/marketplace/MarketplaceCard';
import Preloader from '@/components/ui/Preloader';
import { CommonHeadConstants } from '@/constants/common/head';
import { createMetaImageUtil } from '@/utils/coverUtils';
import { projectNameUtil } from '@/utils/project/projectDetailsUtil';
import { createMetaTitleUtil } from '@/utils/titleUtils';

const TITLE = `Buy now - ${CommonHeadConstants.SITE_NAME}`;
const DESCRIPTION = `Buy the album on ${CommonHeadConstants.SITE_NAME}`;

function MarketplaceItemWrapper({
  marketplaceCardId,
  variablesList: { DIGITAL_MARKETPLACE_ENABLED } = {},
  getMarketplaceCardInProcess,
  marketplaceCards,
}) {
  const marketplaceCard = useMemo(() => marketplaceCards[marketplaceCardId] || {}, [marketplaceCards, marketplaceCardId]);

  const {
    release: { artists = [], album: albumTitle, covers: releaseCovers = [], year, labels = [] } = {},
    covers = releaseCovers,
  } = marketplaceCard;

  const projectName = useMemo(() => projectNameUtil({ artists, albumTitle }), [artists, albumTitle]);

  return (
    <PageDisabledLayout disabled={!DIGITAL_MARKETPLACE_ENABLED}>
      <BaseWebsiteLayout
        headSettings={{
          title: artists.length || albumTitle ? projectName : TITLE,
          withSiteName: false,
          description: DESCRIPTION,
          social: {
            url: TITLE,
            title: `${projectName}${createMetaTitleUtil({ labels, year })}`,
            description: DESCRIPTION,
            image: createMetaImageUtil({ covers }),
          },
        }}
        pageName="marketplace-card-page"
        shownBanners
      >
        <SiteWrapperLayout>
          <Preloader
            id="page-marketplace-card"
            className="page-marketplace-card-preloader"
            isShown={getMarketplaceCardInProcess}
            opacity={1}
          />
          <WrapperContainerLayout direction="column">
            {!getMarketplaceCardInProcess && marketplaceCardId && <MarketplaceCard info={marketplaceCard} />}
          </WrapperContainerLayout>
        </SiteWrapperLayout>
      </BaseWebsiteLayout>
    </PageDisabledLayout>
  );
}

export default connect((state) => ({
  variablesList: state.VariablesReducer.variablesList,

  marketplaceCards: state.MarketplaceCardReducer.marketplaceCards,
  getMarketplaceCardInProcess: state.MarketplaceCardReducer.getMarketplaceCardInProcess,
}))(MarketplaceItemWrapper);
