import { useEffect, useState } from 'react';

import NewPasswordForm from '@/components/forms/auth/NewPasswordForm';
import RecoverPasswordForm from '@/components/forms/auth/RecoverPasswordForm';
import AuthPageLayout from '@/pages/auth/_compoenents/AuthPageLayout';
import NextRouter from '@/services/NextRouter';

function RecoverPasswordWrapper({ email }) {
  const [resetToken, setResetToken] = useState(undefined);

  useEffect(() => {
    const { router: { router: { query: { token } = {} } = {} } = {} } = NextRouter.getInstance();

    setResetToken(token);
  }, []);

  return (
    <AuthPageLayout title="Reset Password">
      {!resetToken ? <RecoverPasswordForm email={email} /> : <NewPasswordForm resetToken={resetToken} />}
    </AuthPageLayout>
  );
}

export default RecoverPasswordWrapper;
