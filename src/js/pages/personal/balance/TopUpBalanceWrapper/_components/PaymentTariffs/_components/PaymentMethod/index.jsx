import PaymentMethodTabs from '@/pages/personal/balance/TopUpBalanceWrapper/_components/PaymentTariffs/_components/PaymentMethodTabs';

import styles from './styles.module.scss';

function PaymentMethod({ paymentTabs, activePaymentMethod, setActivePaymentMethod }) {
  return (
    <div className={styles.paymentMethod}>
      <h4 className={styles.topUpBalanceDescription}>Pay with</h4>
      <PaymentMethodTabs
        paymentTabs={paymentTabs}
        activePaymentMethod={activePaymentMethod}
        setActivePaymentMethod={setActivePaymentMethod}
      />
    </div>
  );
}

export default PaymentMethod;
