import type { LinkRouteProps } from '@/components/ui/links/LinkRoute';
import LinkRoute from '@/components/ui/links/LinkRoute';
import { RoutePathsConstants } from '@/constants/routes/routes';

type TopUpBalanceButtonProps = Omit<LinkRouteProps, 'href'>;

function TopUpBalanceButton({ text = 'Top Up', transparent = true, ...restProps }: TopUpBalanceButtonProps) {
  return (
    <LinkRoute
      text={text}
      href={{ pathname: RoutePathsConstants.TOP_UP_BALANCE }}
      type="button"
      borderColor="black"
      transparent={transparent}
      {...restProps}
    />
  );
}

export default TopUpBalanceButton;
