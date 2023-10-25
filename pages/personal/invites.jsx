import ReferralInformationWrapper from '@/pages/personal/ReferralInformationWrapper';
import { withPrivateAuthRoute } from '@/services/auth/WithPrivateAuthRoute';

function InvitesPage({ section }) {
  return <ReferralInformationWrapper section={section} />;
}

InvitesPage.getInitialProps = async (ctx) => {
  const { query: { section } = {} } = ctx;

  return {
    section,
  };
};

export default withPrivateAuthRoute(InvitesPage);
