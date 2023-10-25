import TopUpBalanceWrapper from '@/pages/personal/balance/TopUpBalanceWrapper';
import { withPrivateAuthRoute } from '@/services/auth/WithPrivateAuthRoute';

function TopUpBalancePage() {
  return <TopUpBalanceWrapper />;
}

export default withPrivateAuthRoute(TopUpBalancePage);
