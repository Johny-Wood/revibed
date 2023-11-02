import LinkDefault from '@/components/ui/links/LinkDefault';
import { RoutePathsConstants } from '@/constants/routes/routes';

function PricingPolicyLink() {
  return <LinkDefault href={RoutePathsConstants.PRIVACY_POLICY} text="pricing policy" className="terms-link underline" />;
}

export default PricingPolicyLink;
