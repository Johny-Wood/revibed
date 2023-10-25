import RulesContent from '@/components/RulesContent';
import { CommonRulesTypesConstants } from '@/constants/common/rules';
import RulesPageLayout from '@/pages/rules/_components/RulesPageLayout';

const TITLE = 'Privacy policy';

function PrivacyPolicyWrapper() {
  return (
    <RulesPageLayout title={TITLE}>
      <RulesContent title={TITLE} rulesName={CommonRulesTypesConstants.PRIVACY_POLICY} />
    </RulesPageLayout>
  );
}

export default PrivacyPolicyWrapper;
