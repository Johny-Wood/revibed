import { useState } from 'react';

import { connect } from 'react-redux';

import Button from '@/components/ui/buttons/Button';
import Coin from '@/components/ui/currency/Coin';
import { PaymentSystemsConstants } from '@/constants/payment/system';
import PayPalLogo from '@/icons/payments/PayPalLogo';
import StripeIcon from '@/icons/payments/StripeIcon';
import { personalTopUpBalanceRequestAction } from '@/redux-actions/personal/balanceActions';
import { floatWithCommaUtil } from '@/utils/textUtils';

import styles from './styles.module.scss';

import PackageList from '../PackageList';

const PAYMENT_BUTTONS_PARAMS = {
  [PaymentSystemsConstants.STRIPE]: {
    text: 'Pay with',
    icon: StripeIcon,
  },
  [PaymentSystemsConstants.PAYPAL]: {
    text: 'Checkout using',
    icon: PayPalLogo,
  },
};

function PaymentTariffsList({
  activePaymentMethod,
  list,
  personalTopUpBalanceRequest,
  personalTopUpBalanceInProcess,
  personalTopUpBalanceSuccess,
}) {
  const [selectedId, setSelectedId] = useState(-1);

  const { text: buttonText, icon: Icon } = PAYMENT_BUTTONS_PARAMS[activePaymentMethod];

  return (
    <>
      <h4 className={styles.topUpBalanceDescription}>Select your top-up amount</h4>
      <div className={styles.topUpBalanceTariffs}>
        <PackageList items={list[activePaymentMethod]} selectedId={selectedId} onChange={(id) => setSelectedId(id)} />
        <div className={styles.topUpBalanceInfo}>
          <p className={styles.topUpBalanceTotal}>
            <Coin
              beforeText="Total: "
              afterText={floatWithCommaUtil(
                list[activePaymentMethod].find(({ id: packageItemId }) => packageItemId === selectedId)?.price
              )}
            />
          </p>
          <div className={styles.topUpBalanceDescription}>
            <div className="text_size_12 c-gray-2">3rd party services % applies</div>
          </div>
        </div>
        <Button
          className={styles.buttonChangeTariff}
          disabled={selectedId <= 0 || personalTopUpBalanceInProcess || personalTopUpBalanceSuccess}
          isInProcess={personalTopUpBalanceInProcess}
          transparent
          onClick={() => {
            if (selectedId <= 0 || personalTopUpBalanceInProcess || personalTopUpBalanceSuccess) {
              return;
            }

            personalTopUpBalanceRequest({
              packId: selectedId,
              paymentSystem: activePaymentMethod,
            })
              .then((redirectUrl = '') => {
                window.open(redirectUrl, '_self');
              })
              .catch(() => {});
          }}
        >
          <span className="text">
            {buttonText}
            &nbsp;
          </span>
          <Icon />
        </Button>
      </div>
    </>
  );
}

export default connect(
  (state) => ({
    personalTopUpBalanceInProcess: state.BalanceReducer.personalTopUpBalanceInProcess,
    personalTopUpBalanceSuccess: state.BalanceReducer.personalTopUpBalanceSuccess,
  }),
  (dispatch) => ({
    personalTopUpBalanceRequest: ({ packId, paymentSystem }) =>
      personalTopUpBalanceRequestAction({ packId, paymentSystem })(dispatch),
  })
)(PaymentTariffsList);
