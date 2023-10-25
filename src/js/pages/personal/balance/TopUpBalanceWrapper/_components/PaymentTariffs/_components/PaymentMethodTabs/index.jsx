import classNames from 'classnames';

import RadioButton from '@/components/ui/inputs/RadioButton';
import { PaymentSystemLabelsTabsConstants } from '@/constants/payment/systemLabelsTabs';

import styles from './styles.module.scss';

function PaymentMethodTabs({ paymentTabs = [], activePaymentMethod, setActivePaymentMethod = () => {} }) {
  if (paymentTabs.length <= 0) {
    return null;
  }

  return (
    <div className={styles.paymentMethodTabs}>
      {paymentTabs.map((system) => {
        const checked = activePaymentMethod === system;
        const key = `payment-method-tab_${system}`;

        return (
          <div key={key} className={classNames([styles.paymentMethodTabs__tab, checked && styles.paymentMethodTabs__tab_active])}>
            <RadioButton
              id={key}
              label={PaymentSystemLabelsTabsConstants[system]}
              name="payment-method"
              onChange={() => {
                setActivePaymentMethod(system);
              }}
              checked={checked}
              rounded
              className={styles.radioButtonBlock}
              buttonClassName={styles.radioButton}
              textClassName={styles.radioButton__text}
            />
          </div>
        );
      })}
    </div>
  );
}

export default PaymentMethodTabs;
