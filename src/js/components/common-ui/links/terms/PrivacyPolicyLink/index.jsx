import LinkDefault from '@/components/ui/links/LinkDefault';
import { RoutePathsConstants } from '@/constants/routes/routes';

function PrivacyPolicyLink() {
  return <LinkDefault href={RoutePathsConstants.PRIVACY_POLICY} text="Privacy Policy" className="terms-link underline" />;
}

export default PrivacyPolicyLink;
