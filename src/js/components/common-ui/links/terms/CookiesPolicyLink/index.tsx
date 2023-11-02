import LinkDefault from '@/components/ui/links/LinkDefault';
import { RoutePathsConstants } from '@/constants/routes/routes';

type CookiesPolicyLinkProps = {
  color?: string;
};

function CookiesPolicyLink({ color }: CookiesPolicyLinkProps) {
  return <LinkDefault className={color} href={RoutePathsConstants.COOKIES_POLICY} text="Cookies Policy" />;
}

export default CookiesPolicyLink;
