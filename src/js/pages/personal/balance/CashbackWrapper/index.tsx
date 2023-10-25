import type { ConnectedProps } from 'react-redux';
import { connect } from 'react-redux';

import TabContent from '@/components/common/tabs/TabContent';
import BaseWebsiteLayout from '@/components/layouts/BaseWebsiteLayout';
import PageDisabledLayout from '@/components/layouts/PageDisabledLayout';
import PersonalPageLayout from '@/components/layouts/PersonalPageLayout';
import BalancePageWrapper from '@/components/personal/balance/BalancePageWrapper';
import type { RootState } from '@/js/redux/reducers';
import CashbackWrapperBanner from '@/pages/personal/balance/CashbackWrapper/_components/CashbackWrapperBanner';
import CashbackWrapperInfo from '@/pages/personal/balance/CashbackWrapper/_components/CashbackWrapperInfo';
import CashbackWrapperTotalInfo from '@/pages/personal/balance/CashbackWrapper/_components/CashbackWrapperTotalInfo';

import styles from './styles.module.scss';

type PropsFromRedux = ConnectedProps<typeof connector>;

const CashbackWrapper = ({ variablesList: { ISSUANCE_OF_CASHBACK_ENABLED } }: PropsFromRedux) => (
  <PageDisabledLayout disabled={!ISSUANCE_OF_CASHBACK_ENABLED}>
    <BaseWebsiteLayout
      headSettings={{
        title: 'Cashback',
      }}
      shownBanners
    >
      <PersonalPageLayout>
        <BalancePageWrapper>
          <TabContent>
            <div className={styles.CashbackWrapper}>
              <CashbackWrapperBanner />
              <CashbackWrapperInfo />
              <CashbackWrapperTotalInfo />
            </div>
          </TabContent>
        </BalancePageWrapper>
      </PersonalPageLayout>
    </BaseWebsiteLayout>
  </PageDisabledLayout>
);

const connector = connect((state: RootState) => ({
  variablesList: state.VariablesReducer.variablesList,
}));

export default connector(CashbackWrapper);
