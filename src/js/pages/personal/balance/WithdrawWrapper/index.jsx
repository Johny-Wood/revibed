import TabContent from '@/components/common/tabs/TabContent';
import WithdrawForm from '@/components/forms/personal/profile/WithdrawForm';
import BaseWebsiteLayout from '@/components/layouts/BaseWebsiteLayout';
import PersonalPageLayout from '@/components/layouts/PersonalPageLayout';
import BalancePageWrapper from '@/components/personal/balance/BalancePageWrapper';
import WithdrawTable from '@/components/tables/WithdrawTable';

import styles from './styles.module.scss';

function WithdrawWrapper() {
  return (
    <BaseWebsiteLayout
      headSettings={{
        title: 'Withdraw Funds',
      }}
      shownBanners
    >
      <PersonalPageLayout>
        <BalancePageWrapper>
          <TabContent>
            <div className={styles.withdraw}>
              <WithdrawForm />
              <div className={styles.withdraw__section}>
                <WithdrawTable />
              </div>
            </div>
          </TabContent>
        </BalancePageWrapper>
      </PersonalPageLayout>
    </BaseWebsiteLayout>
  );
}

export default WithdrawWrapper;
