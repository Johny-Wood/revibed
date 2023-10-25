import BalanceWrapper from '@/pages/personal/balance/BalanceWrapper';
import { withPrivateAuthRoute } from '@/services/auth/WithPrivateAuthRoute';

function BalancePage() {
  return <BalanceWrapper />;
}

export default withPrivateAuthRoute(BalancePage);
