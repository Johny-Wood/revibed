import PropTypes from 'prop-types';

import Package from '@/pages/personal/balance/TopUpBalanceWrapper/_components/PaymentTariffs/_components/Package';

import styles from './styles.module.scss';

function PackageList({
  items = [],

  selectedId,
  onChange,
}) {
  const hasNameField = items.findIndex(({ name }) => name) > -1;
  const hasCoinsCountField = items.findIndex(({ coinsCount }) => coinsCount >= 0) > -1;
  const hasPriceField = items.findIndex(({ price }) => price >= 0) > -1;

  return (
    <div className={styles.packageList}>
      {items.map(({ id, price, name, coinsCount, color, bonus }) => (
        <Package
          key={`top-up-balance-package-${id}`}
          id={id}
          price={price}
          color={color}
          coinsCount={coinsCount}
          name={name}
          bonus={bonus}
          checked={selectedId === id}
          onChange={() => onChange(id)}
          hasNameField={hasNameField}
          hasCoinsCountField={hasCoinsCountField}
          hasPriceField={hasPriceField}
        />
      ))}
    </div>
  );
}

PackageList.propTypes = {
  items: PropTypes.array,
  selectedId: PropTypes.number,
  onChange: PropTypes.func,
};

PackageList.defaultProps = {
  items: [],
  selectedId: -1,
  onChange: () => {},
};

export default PackageList;
