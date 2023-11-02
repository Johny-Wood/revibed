import BlackBanner from '@/components/common/banners/BlackBanner';
import { RoutePathsConstants } from '@/constants/routes/routes';

type ToPreOrdersBlackBannerProps = {
  isMobile?: boolean;
  className?: string;
};

export default function ToPreOrdersBlackBanner(props: ToPreOrdersBlackBannerProps) {
  return (
    <BlackBanner
      title="Join the vibe digger&rsquo;s world is&nbsp;into!"
      link={{
        href: RoutePathsConstants.PROJECTS,
        text: 'Browse Pre-orders',
      }}
      {...props}
    />
  );
}
