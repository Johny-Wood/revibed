import { useState } from 'react';

import PaymentMethod from '@/pages/personal/balance/TopUpBalanceWrapper/_components/PaymentTariffs/_components/PaymentMethod';
import PaymentTariffsList from '@/pages/personal/balance/TopUpBalanceWrapper/_components/PaymentTariffs/_components/PaymentTariffsList';

function PaymentTariffs({ list = {} }) {
  const paymentMethods = Object.keys(list);
  const [activePaymentMethod, setActivePaymentMethod] = useState(paymentMethods[0]);

  return (
    <>
      <h1>Buy funds to&nbsp;contribute and publish pre-order</h1>
      <PaymentMethod
        paymentTabs={paymentMethods}
        activePaymentMethod={activePaymentMethod}
        setActivePaymentMethod={setActivePaymentMethod}
      />
      <PaymentTariffsList activePaymentMethod={activePaymentMethod} list={list} />
    </>
  );
}

export default PaymentTariffs;
