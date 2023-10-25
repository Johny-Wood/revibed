import type { PropsWithChildren } from 'react';
import { useMemo } from 'react';

import classNames from 'classnames';
import parse from 'html-react-parser';

import GoldenCoinIcon from '@/icons/GoldenCoinIcon';

import styles from './styles.module.scss';

type CoinProps = PropsWithChildren & {
  beforeText?: string;
  afterText?: string;
  colorUrl?: string;
  size?: number;
  color?: string;
  className?: string;
  isGoldenCoin?: boolean;
};

function Coin({
  size,
  color,
  colorUrl,
  beforeText,
  afterText,
  isGoldenCoin,

  className,

  children,
}: CoinProps) {
  const classNamesEnd = useMemo(() => classNames('coin', styles.coin), []);

  return (
    <span className={classNames('coin-value i-f_y-center', className)}>
      {beforeText}
      {!isGoldenCoin ? (
        '€'
      ) : (
        <GoldenCoinIcon
          size={size}
          className={classNamesEnd}
          color={color}
          colorUrl={colorUrl}
          shadow={undefined}
          rotate={undefined}
        />
      )}
      {children}
      {parse(afterText ?? '')}
    </span>
  );
}

export default Coin;
