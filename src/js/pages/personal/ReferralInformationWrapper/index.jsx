import BaseWebsiteLayout from '@/components/layouts/BaseWebsiteLayout';
import PersonalPageLayout from '@/components/layouts/PersonalPageLayout';
import ReferralHistoryTable from '@/components/tables/ReferralHistoryTable';
import ReferralBanner from '@/pages/personal/ReferralInformationWrapper/_components/ReferralBanner';
import ReferralInformation from '@/pages/personal/ReferralInformationWrapper/_components/ReferralInformation';

import styles from './styles.module.scss';

const TITLE = 'Invites';

function ReferralInformationWrapper({ section }) {
  return (
    <BaseWebsiteLayout
      headSettings={{
        title: TITLE,
      }}
      shownBanners
    >
      <PersonalPageLayout>
        <div className={styles.referral}>
          <ReferralBanner />
          <ReferralInformation />
          <ReferralHistoryTable section={section} />
        </div>
      </PersonalPageLayout>
    </BaseWebsiteLayout>
  );
}

export default ReferralInformationWrapper;
