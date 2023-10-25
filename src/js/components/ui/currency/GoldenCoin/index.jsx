import classNames from 'classnames';
import parse from 'html-react-parser';

import GoldenCoinIcon from '@/icons/GoldenCoinIcon';

function GoldenCoin({
  afterText = '',
  shadow,
  size,
  rotate,
  className = '',

  children,
}) {
  return (
    <span className={classNames('golden-coin-value i-f_y-center', className)}>
      {children}
      <GoldenCoinIcon shadow={shadow} size={size} rotate={rotate} />
      {parse(afterText)}
    </span>
  );
}

export default GoldenCoin;
