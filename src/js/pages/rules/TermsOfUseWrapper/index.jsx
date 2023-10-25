import RulesContent from '@/components/RulesContent';
import { CommonRulesTypesConstants } from '@/constants/common/rules';
import RulesPageLayout from '@/pages/rules/_components/RulesPageLayout';

const TITLE = 'Terms of use';

function TermsOfUseWrapper() {
  return (
    <RulesPageLayout title={TITLE}>
      <RulesContent title={TITLE} rulesName={CommonRulesTypesConstants.TERMS_OF_USE} />
    </RulesPageLayout>
  );
}

export default TermsOfUseWrapper;
