import CreateProjectPageWrapper from '@/pages/personal/draft/CreateProjectPageWrapper';
import { withPrivateAuthRoute } from '@/services/auth/WithPrivateAuthRoute';

function CreateProjectPage() {
  return <CreateProjectPageWrapper />;
}

export default withPrivateAuthRoute(CreateProjectPage);
