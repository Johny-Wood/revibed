import { connect } from 'react-redux';

import ListPageWrapper from '@/components/common/list/ListPageWrapper';
import BaseWebsiteLayout from '@/components/layouts/BaseWebsiteLayout';
import PageDisabledLayout from '@/components/layouts/PageDisabledLayout';
import PersonalPageLayout from '@/components/layouts/PersonalPageLayout';
import PurchasesOrder from '@/components/marketplace/purchases/PurchasesOrder';
import { RoutePathsConstants } from '@/constants/routes/routes';
import ScrollBlockIdConstants from '@/constants/scroll/scrollBlockId';
import TitlesConstants from '@/constants/titles/titlesConstants';
import PurchasesIcon from '@/icons/marketplace/PurchasesIcon';
import { getPurchasesRequestAction } from '@/redux-actions/personal/purchasesActions';

import styles from './styles.module.scss';

const metaTitle = TitlesConstants.MY_PURCHASES;

function PurchasesNoResults() {
  return (
    <div className="f_direction_column f-y-center f-x-center">
      <PurchasesIcon />
      <p className="m-top-20">You haven&rsquo;t made any purchases yet</p>
    </div>
  );
}

function PurchasesWrapper({
  list,
  pageSettings,
  getPurchasesFromApi,
  getPurchasesInProcess,
  getPurchasesRequest,
  variablesList: { DIGITAL_MARKETPLACE_ENABLED } = {},
}) {
  return (
    <PageDisabledLayout disabled={!DIGITAL_MARKETPLACE_ENABLED}>
      <BaseWebsiteLayout
        headSettings={{
          title: metaTitle,
        }}
        shownBanners
      >
        <PersonalPageLayout>
          <div className={styles.purchases}>
            <ListPageWrapper
              location="PURCHASES"
              inProcess={getPurchasesInProcess}
              itemComponent={PurchasesOrder}
              items={list}
              withHeaderControl={false}
              withFiltersAndSort={false}
              pageSettings={pageSettings}
              request={getPurchasesRequest}
              path={RoutePathsConstants.PERSONAL_PURCHASES}
              scrollId={ScrollBlockIdConstants.PURCHASES_ID}
              noResults={{
                text: null,
                component: getPurchasesFromApi ? PurchasesNoResults : null,
              }}
              listWithPadding={false}
              listClassName={styles.itemsList__list}
              blockClassName={styles.itemsList__block}
            />
          </div>
        </PersonalPageLayout>
      </BaseWebsiteLayout>
    </PageDisabledLayout>
  );
}

export default connect(
  (state) => ({
    variablesList: state.VariablesReducer.variablesList,
    list: state.PurchasesReducer.list,
    pageSettings: state.PurchasesReducer.pageSettings,
    getPurchasesFromApi: state.PurchasesReducer.getPurchasesFromApi,
    getPurchasesInProcess: state.PurchasesReducer.getPurchasesInProcess,
  }),
  (dispatch) => ({
    getPurchasesRequest: (params) => getPurchasesRequestAction({ ...params, dispatch }),
  })
)(PurchasesWrapper);
