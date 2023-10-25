import ContactAdminWrapper from '@/pages/personal/ContactAdminWrapper';
import { withPrivateAuthRoute } from '@/services/auth/WithPrivateAuthRoute';

function ContactAdminPage() {
  return <ContactAdminWrapper />;
}

export default withPrivateAuthRoute(ContactAdminPage);
