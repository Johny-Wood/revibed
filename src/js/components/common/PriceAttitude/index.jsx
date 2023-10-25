import classNames from 'classnames';

import Coin from '@/components/ui/currency/Coin';

function PriceAttitude({ className = '' }) {
  return (
    <div className={classNames('c-gray-2 text_size_12 price-attitude', className)}>
      <Coin color="gray-2" offset={false} size={12}>
        1
      </Coin>
      &nbsp;= 1&euro;
    </div>
  );
}

export default PriceAttitude;
