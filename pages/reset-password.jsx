import RecoverPasswordWrapper from '@/pages/auth/RecoverPasswordWrapper';
import { withPrivateNotAuthRoute } from '@/services/auth/WithPrivateAuthRoute';

function RecoverPasswordPage({ email }) {
  return <RecoverPasswordWrapper email={email} />;
}

RecoverPasswordPage.getInitialProps = async ({ query: { email = '' } = {} }) => ({
  email,
});

export default withPrivateNotAuthRoute(RecoverPasswordPage);
