import SignInForm from '@/components/forms/auth/SignInForm';
import AuthPageLayout from '@/pages/auth/_compoenents/AuthPageLayout';

function SignInWrapper({ email }) {
  return (
    <AuthPageLayout title="Log In">
      <SignInForm email={email} />
    </AuthPageLayout>
  );
}

export default SignInWrapper;
