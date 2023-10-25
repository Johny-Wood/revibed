import classNames from 'classnames';
import PropTypes from 'prop-types';

import globalStyles from '@/assets/styles/global-classes.module.scss';
import TransitionSwitchLayout from '@/components/layouts/TransitionLayouts/TransitionSwitchLayout';
import Coin from '@/components/ui/currency/Coin';
import { floatWithCommaFixedUtil } from '@/utils/textUtils';

import styles from './styles.module.scss';

const estimatedPrice = (value, { coin } = {}) => {
  const floatValue = floatWithCommaFixedUtil(value);

  return (
    <div className={classNames(styles.projectPriceDetails__estimated, globalStyles.lineThrough)}>
      {!coin ? (
        floatValue
      ) : (
        <Coin size={13} type="xl" color="gray-2">
          {floatValue}
        </Coin>
      )}
    </div>
  );
};

function ProjectPriceDetails({
  priceInfo: {
    itemPrice = 0,
    shipping = 0,
    customsTax = 0,
    ripperReward = 0,
    total = 0,
    rounded,
    insurance: { pct: insurancePct = 0, coin: insuranceCoin = 0 } = {},
    commission: { pct: commissionPct = 0, coin: commissionCoin = 0 } = {},
    copyrightHoldersFundShare: { coin: copyrightHoldersFundShareCoin = 0 } = {},
  } = {},
  estimatedPriceInfo,
  estimatedPriceInfo: {
    itemPrice: estimatedItemPrice,
    shipping: estimatedShipping,
    customsTax: estimatedCustomsTax,
    ripperReward: estimatedRipperReward,
    total: estimatedTotal,
    insurance: { coin: estimatedInsuranceCoin } = {},
    commission: { coin: estimatedCommissionCoin } = {},
    copyrightHoldersFundShare: { coin: estimatedCopyrightHoldersFundShareCoin } = {},
  } = {},
}) {
  const itemPriceAndShipping = itemPrice + shipping + customsTax;
  const estimatedItemPriceAndShipping = estimatedItemPrice + estimatedShipping + estimatedCustomsTax;

  return (
    <div className={styles.projectPriceDetails}>
      <div className={styles.projectPriceDetails__title}>
        <b>Project price details</b>
        <TransitionSwitchLayout isShown={!estimatedPriceInfo}>
          <span className="c-gray-2">&nbsp;(estimated)</span>
        </TransitionSwitchLayout>
      </div>
      <div className={styles.projectPriceDetails__table}>
        <div className={styles.projectPriceDetails__row}>
          <div className={styles.projectPriceDetails__description}>
            Item price + shipping
            <TransitionSwitchLayout isShown={!estimatedPriceInfo}>
              <span>*</span>
            </TransitionSwitchLayout>
          </div>
          <div className={styles.projectPriceDetails__value}>
            {floatWithCommaFixedUtil(itemPriceAndShipping)}
            <TransitionSwitchLayout
              isShown={estimatedItemPriceAndShipping >= 0 && estimatedItemPriceAndShipping !== itemPriceAndShipping}
            >
              {estimatedPrice(estimatedItemPriceAndShipping)}
            </TransitionSwitchLayout>
          </div>
        </div>
        <div className={styles.projectPriceDetails__row}>
          <div className={styles.projectPriceDetails__description}>Digitization</div>
          <div className={styles.projectPriceDetails__value}>
            {floatWithCommaFixedUtil(ripperReward)}
            <TransitionSwitchLayout isShown={estimatedRipperReward >= 0 && estimatedRipperReward !== ripperReward}>
              {estimatedPrice(estimatedRipperReward)}
            </TransitionSwitchLayout>
          </div>
        </div>
        <div className={styles.projectPriceDetails__row}>
          <div className={styles.projectPriceDetails__description}>
            Commission ({commissionPct}
            %)
          </div>
          <div className={styles.projectPriceDetails__value}>
            {floatWithCommaFixedUtil(commissionCoin)}
            <TransitionSwitchLayout isShown={estimatedCommissionCoin >= 0 && estimatedCommissionCoin !== commissionCoin}>
              {estimatedPrice(estimatedCommissionCoin)}
            </TransitionSwitchLayout>
          </div>
        </div>
        <div className={styles.projectPriceDetails__row}>
          <div className={styles.projectPriceDetails__description}>
            Insurance ({insurancePct}
            %)
          </div>
          <div className={styles.projectPriceDetails__value}>
            {floatWithCommaFixedUtil(insuranceCoin)}
            <TransitionSwitchLayout isShown={estimatedInsuranceCoin >= 0 && estimatedInsuranceCoin !== insuranceCoin}>
              {estimatedPrice(estimatedInsuranceCoin)}
            </TransitionSwitchLayout>
          </div>
        </div>
        <div className={styles.projectPriceDetails__row}>
          <div className={styles.projectPriceDetails__description}>Project artist fund</div>
          <div className={styles.projectPriceDetails__value}>
            {floatWithCommaFixedUtil(copyrightHoldersFundShareCoin)}
            <TransitionSwitchLayout
              isShown={
                estimatedCopyrightHoldersFundShareCoin >= 0 &&
                estimatedCopyrightHoldersFundShareCoin !== copyrightHoldersFundShareCoin
              }
            >
              {estimatedPrice(estimatedCopyrightHoldersFundShareCoin)}
            </TransitionSwitchLayout>
          </div>
        </div>
        <div className={styles.projectPriceDetails__row}>
          <div className={styles.projectPriceDetails__description}>
            Total
            {rounded ? '(rounded)' : ''}
          </div>
          <div className={styles.projectPriceDetails__value}>
            <Coin size={13} type="xl">
              {floatWithCommaFixedUtil(total)}
            </Coin>
            <TransitionSwitchLayout isShown={estimatedTotal >= 0 && estimatedTotal !== total}>
              {estimatedPrice(estimatedTotal, { coin: true })}
            </TransitionSwitchLayout>
          </div>
        </div>
      </div>
      <div className="m-top-15">
        <p className="c-gray-2 text_size_11">
          {!estimatedPriceInfo ? (
            <>
              * VAT 19% included. Estimated cost. The actual cost will be&nbsp;deducted upon purchase of&nbsp;the record. The
              difference will be&nbsp;taken into account in&nbsp;the distribution of&nbsp;fund
            </>
          ) : (
            <>
              The difference between estimated and actual cost will be taken into account in the distribution of fund.
              <br />
              <b>Custom tax to&nbsp;be&nbsp;deducted after custom clearance (if&nbsp;applicable)</b>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

ProjectPriceDetails.defaultProps = {
  priceInfo: {},
};

ProjectPriceDetails.propTypes = {
  priceInfo: PropTypes.object,
};

export default ProjectPriceDetails;
