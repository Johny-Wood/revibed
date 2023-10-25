import range from 'lodash/range';

import Coin from '@/components/ui/currency/Coin';
import Gem from '@/components/ui/currency/Gem';
import GoldenCoin from '@/components/ui/currency/GoldenCoin';
import { floatWithCommaFixedUtil } from '@/utils/textUtils';

function Bonus({ bonus: { bonusCount, count = bonusCount, bonusType, type = bonusType } }) {
  return (
    <>
      {type === 'GOLDEN_COIN' &&
        range(count > 3 ? 1 : count).map((key) => (
          <GoldenCoin
            key={`payment-golden-coin-${type}-${key}`}
            size={15}
            className="m-top-2-minus"
            afterText={count > 3 ? `x${count}` : ''}
          />
        ))}
      {type === 'GEM' &&
        range(count > 3 ? 1 : count).map((key) => (
          <Gem key={`payment-gem-${type}-${key}`} size={15} afterText={count > 3 ? `x${count}` : ''} />
        ))}
    </>
  );
}

function CoinAndBonusCounts({ withComma, coinsCount = 0, bonus }) {
  return Number(coinsCount) >= 0 ? (
    <span className="i-f_y-center">
      {Number(coinsCount) > 0 && (
        <>
          <Coin>{withComma ? floatWithCommaFixedUtil(coinsCount) : coinsCount}</Coin>
          {!!bonus && <>&nbsp;+&nbsp;</>}
        </>
      )}
      {!!bonus && <Bonus bonus={bonus} />}
    </span>
  ) : null;
}

export default CoinAndBonusCounts;
