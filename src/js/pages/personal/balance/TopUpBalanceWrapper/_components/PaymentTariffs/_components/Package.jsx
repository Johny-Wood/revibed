import PropTypes from 'prop-types';

import CoinAndBonusCounts from '@/components/common/CoinAndBonusCounts';
import RadioButton from '@/components/ui/inputs/RadioButton';

import styles from './styles.module.scss';

function Package({
  id,
  name = '',
  price = '',
  coinsCount = 0,
  color,
  bonus,
  checked,
  onChange,

  hasNameField,
  hasCoinsCountField,
  hasPriceField,
  hidePrice = true,
}) {
  return (
    <label htmlFor={id} className={styles.package} style={{ backgroundColor: color }}>
      <RadioButton
        id={id}
        name="balance-package"
        className={styles.radioButtonBlock}
        onChange={onChange}
        checked={checked}
        rounded
      />
      <p className={styles.package__info}>
        {(name || hasNameField) && (
          <span className={styles.package__name} title={name}>
            {name}
          </span>
        )}
        {(coinsCount >= 0 || hasCoinsCountField) && (
          <span className={styles.package__priceCoin}>
            <CoinAndBonusCounts coinsCount={coinsCount} bonus={bonus} />
          </span>
        )}
        {(price >= 0 || hasPriceField) && !hidePrice && (
          <span className={styles.package__priceEuro}>
            {price >= 0 && (
              <>
                {price}
                &euro;
              </>
            )}
          </span>
        )}
      </p>
    </label>
  );
}

Package.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  price: PropTypes.number,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
};

Package.defaultProps = {
  id: -1,
  name: undefined,
  price: 0,
  checked: false,
  onChange: () => {},
};

export default Package;
