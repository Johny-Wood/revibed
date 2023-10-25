import { useMemo } from 'react';

import { connect } from 'react-redux';

import BackButton from '@/components/common-ui/buttons/BackButton';
import BaseWebsiteLayout from '@/components/layouts/BaseWebsiteLayout';
import PageDisabledLayout from '@/components/layouts/PageDisabledLayout';
import PersonalPageLayout from '@/components/layouts/PersonalPageLayout';
import PurchasesOrder from '@/components/marketplace/purchases/PurchasesOrder';
import ComponentsCommonConstants from '@/constants/components/common';
import { RoutePathsConstants } from '@/constants/routes/routes';
import TitlesConstants from '@/constants/titles/titlesConstants';

import styles from './styles.module.scss';

const metaTitle = TitlesConstants.PURCHASE;

function PurchaseWrapper({ cards, purchaseId, variablesList: { DIGITAL_MARKETPLACE_ENABLED } = {} }) {
  const item = useMemo(() => cards[purchaseId] || [], [cards, purchaseId]);
  return (
    <PageDisabledLayout disabled={!DIGITAL_MARKETPLACE_ENABLED}>
      <BaseWebsiteLayout
        headSettings={{
          title: metaTitle,
        }}
        shownBanners
      >
        <PersonalPageLayout backRouteHrefDefault={RoutePathsConstants.PERSONAL_PURCHASES}>
          <div className={styles.purchase}>
            <BackButton hrefDefault={RoutePathsConstants.PERSONAL_PURCHASES} buttonClassName={styles.purchase__backButton} />
            <PurchasesOrder
              item={item}
              withRoute={false}
              downloadButton={{
                size: ComponentsCommonConstants.Size.LARGE,
                transparent: false,
                borderColor: undefined,
                iconColor: 'white',
              }}
              className={styles.purchasesOrder}
              idClassName={styles.purchasesOrder__id}
            />
          </div>
        </PersonalPageLayout>
      </BaseWebsiteLayout>
    </PageDisabledLayout>
  );
}

export default connect((state) => ({
  variablesList: state.VariablesReducer.variablesList,
  cards: state.PurchasesReducer.cards,
}))(PurchaseWrapper);
