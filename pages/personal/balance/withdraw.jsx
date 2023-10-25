import WithdrawWrapper from '@/pages/personal/balance/WithdrawWrapper';
import { withPrivateAuthRoute } from '@/services/auth/WithPrivateAuthRoute';

function WithdrawPage() {
  return <WithdrawWrapper />;
}

export default withPrivateAuthRoute(WithdrawPage);
