import classNames from 'classnames';

import LinkRoute from '@/components/ui/links/LinkRoute';
import { RoutePathsConstants } from '@/constants/routes/routes';

function TopUpBalanceButton({
  className = '',
  textClassName = '',
  text = 'Top Up',
  transparent = true,
  size,
  rounded,
  onClick = () => {},
}) {
  return (
    <LinkRoute
      text={text}
      href={RoutePathsConstants.TOP_UP_BALANCE}
      type="button"
      className={classNames(className)}
      textClassName={textClassName}
      transparent={transparent}
      onClick={onClick}
      size={size}
      rounded={rounded}
    />
  );
}

export default TopUpBalanceButton;
