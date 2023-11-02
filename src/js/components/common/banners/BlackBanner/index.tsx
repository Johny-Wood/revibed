import classNames from 'classnames';
import parse from 'html-react-parser';

import type { LinkRouteProps } from '@/components/ui/links/LinkRoute';
import LinkRoute from '@/components/ui/links/LinkRoute';

import styles from './styles.module.scss';

type BlackBannerProps = {
  title: string;
  link: LinkRouteProps;
  isMobile?: boolean;

  className?: string;
};

export default function BlackBanner({
  isMobile,
  title,
  link,

  className,
}: BlackBannerProps) {
  return (
    <div className={classNames(styles.BlackBanner, isMobile && styles.BlackBanner_is_mobile, className)}>
      <div className={styles.BlackBanner__title}>{parse(title)}</div>
      <LinkRoute
        {...link}
        rounded
        type="button"
        className={styles.BlackBanner__button}
        textClassName={styles.BlackBanner__button__text}
      />
    </div>
  );
}
