import { useEffect } from 'react';

import isEmpty from 'lodash/isEmpty';
import { connect } from 'react-redux';

import TabContent from '@/components/common/tabs/TabContent';
import BaseWebsiteLayout from '@/components/layouts/BaseWebsiteLayout';
import PersonalPageLayout from '@/components/layouts/PersonalPageLayout';
import BalancePageWrapper from '@/components/personal/balance/BalancePageWrapper';
import PaymentHistoryTable from '@/components/tables/PaymentHistoryTable';
import PaymentTariffs from '@/pages/personal/balance/TopUpBalanceWrapper/_components/PaymentTariffs';
import { loadPersonalTopUpBalanceRequestAction } from '@/redux-actions/personal/balanceActions';

import styles from './styles.module.scss';

function TopUpBalanceWrapper({ loadPersonalTopUpBalanceFromApi, loadPersonalTopUpBalanceList, loadPersonalTopUpBalanceRequest }) {
  useEffect(() => {
    if (!loadPersonalTopUpBalanceFromApi) {
      loadPersonalTopUpBalanceRequest();
    }
  }, [loadPersonalTopUpBalanceFromApi, loadPersonalTopUpBalanceRequest]);

  return (
    <BaseWebsiteLayout
      headSettings={{
        title: 'Top Up',
      }}
      shownBanners
    >
      <PersonalPageLayout>
        <BalancePageWrapper>
          <TabContent>
            <div className={styles.topUpBalance}>
              {!isEmpty(loadPersonalTopUpBalanceList) && <PaymentTariffs list={loadPersonalTopUpBalanceList} />}
              <PaymentHistoryTable />
            </div>
          </TabContent>
        </BalancePageWrapper>
      </PersonalPageLayout>
    </BaseWebsiteLayout>
  );
}

export default connect(
  (state) => ({
    loadPersonalTopUpBalanceList: state.BalanceReducer.loadPersonalTopUpBalanceList,
    loadPersonalTopUpBalanceFromApi: state.BalanceReducer.loadPersonalTopUpBalanceFromApi,
  }),
  (dispatch) => ({
    loadPersonalTopUpBalanceRequest: () => loadPersonalTopUpBalanceRequestAction({ dispatch }),
  })
)(TopUpBalanceWrapper);
