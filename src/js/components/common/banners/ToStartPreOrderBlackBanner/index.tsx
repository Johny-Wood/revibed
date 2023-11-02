import BlackBanner from '@/components/common/banners/BlackBanner';
import { RoutePathsConstants } from '@/constants/routes/routes';

type ToStartPreOrderBlackBannerProps = {
  isMobile?: boolean;
  className?: string;
};

export default function ToStartPreOrderBlackBanner(props: ToStartPreOrderBlackBannerProps) {
  return (
    <BlackBanner
      title="Did’t find<br/>&nbsp;your music?"
      link={{
        href: RoutePathsConstants.DRAFTS_ADD,
        text: 'Start your Pre-order',
      }}
      {...props}
    />
  );
}
