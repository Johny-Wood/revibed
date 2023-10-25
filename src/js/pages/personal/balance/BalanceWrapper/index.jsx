import TabContent from '@/components/common/tabs/TabContent';
import BaseWebsiteLayout from '@/components/layouts/BaseWebsiteLayout';
import PersonalPageLayout from '@/components/layouts/PersonalPageLayout';
import BalancePageWrapper from '@/components/personal/balance/BalancePageWrapper';
import UserBalanceTable from '@/components/tables/UserBalanceTable';

function BalanceWrapper() {
  return (
    <BaseWebsiteLayout
      headSettings={{
        title: 'Balance',
      }}
      shownBanners
    >
      <PersonalPageLayout>
        <BalancePageWrapper>
          <TabContent>
            <UserBalanceTable />
          </TabContent>
        </BalancePageWrapper>
      </PersonalPageLayout>
    </BaseWebsiteLayout>
  );
}

export default BalanceWrapper;
