import HeadTag from '@/components/document/head/HeadTag';
import Preloader from '@/components/ui/Preloader';

function SignUpReferralWrapper() {
  return (
    <>
      <HeadTag
        headSettings={{
          title: 'Sign Up',
        }}
      />
      <Preloader id="referral-user" withOffsets={false} isShown color="gray" opcity={1} />
    </>
  );
}

export default SignUpReferralWrapper;
