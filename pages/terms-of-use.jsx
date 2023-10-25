import { CommonRulesTypesConstants } from '@/constants/common/rules';
import TermsOfUseWrapper from '@/pages/rules/TermsOfUseWrapper';
import { SSRLoadRules } from '@/SSR/requests/common/SSRRulesRequests';

function TermsOfUsePage() {
  return <TermsOfUseWrapper />;
}

TermsOfUsePage.getInitialProps = async (ctx) => {
  const awaitPromises = [];

  awaitPromises.push(
    SSRLoadRules({
      ...ctx,
      rulesName: CommonRulesTypesConstants.TERMS_OF_USE,
    })
  );

  await Promise.all(awaitPromises);

  return { props: {} };
};

export default TermsOfUsePage;
