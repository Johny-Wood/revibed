import Preloader from '@/components/ui/Preloader';

function SocialAuthCallbackWrapper() {
  return <Preloader id="social-auth" withOffsets={false} isShown color="gray" opcity={1} />;
}

export default SocialAuthCallbackWrapper;
