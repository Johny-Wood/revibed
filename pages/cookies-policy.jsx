import { CommonRulesTypesConstants } from '@/constants/common/rules';
import CookiesPolicyWrapper from '@/pages/rules/CookiesPolicyWrapper';
import { SSRLoadRules } from '@/SSR/requests/common/SSRRulesRequests';

function CookiesPolicyPage() {
  return <CookiesPolicyWrapper />;
}

CookiesPolicyPage.getInitialProps = async (ctx) => {
  const awaitPromises = [];

  awaitPromises.push(
    SSRLoadRules({
      ...ctx,
      rulesName: CommonRulesTypesConstants.COOKIES_POLICY,
    })
  );

  await Promise.all(awaitPromises);

  return { props: {} };
};

export default CookiesPolicyPage;
