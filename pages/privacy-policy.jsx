import { CommonRulesTypesConstants } from '@/constants/common/rules';
import PrivacyPolicyWrapper from '@/pages/rules/PrivacyPolicyWrapper';
import { SSRLoadRules } from '@/SSR/requests/common/SSRRulesRequests';

function PrivacyPolicyPage() {
  return <PrivacyPolicyWrapper />;
}

PrivacyPolicyPage.getInitialProps = async (ctx) => {
  const awaitPromises = [];

  awaitPromises.push(
    SSRLoadRules({
      ...ctx,
      rulesName: CommonRulesTypesConstants.PRIVACY_POLICY,
    })
  );

  await Promise.all(awaitPromises);

  return { props: {} };
};

export default PrivacyPolicyPage;
