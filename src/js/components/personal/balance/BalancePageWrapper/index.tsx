import type { PropsWithChildren } from 'react';

import BalanceTabs from '@/components/personal/balance/BalanceTabs';

type BalancePageWrapperProps = PropsWithChildren;

function BalancePageWrapper({ children }: BalancePageWrapperProps) {
  return (
    <>
      <BalanceTabs />
      {children}
    </>
  );
}

export default BalancePageWrapper;
