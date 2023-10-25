import ViewportHook from '@/hooks/viewport/ViewportHook';
import LandingRipsDesktop from '@/pages/landing/LandingWrapper/_components/sections/LandingRipsSection/_components/LandingRipsDesktop/LandingRipsDesktop';
import LandingRipsMobile from '@/pages/landing/LandingWrapper/_components/sections/LandingRipsSection/_components/LandingRipsMobile/LandingRipsMobile';

function LandingRipsSection(props) {
  const { isNotDesktop } = ViewportHook();

  if (isNotDesktop) {
    return <LandingRipsMobile {...props} />;
  }

  return <LandingRipsDesktop {...props} />;
}

export default LandingRipsSection;
