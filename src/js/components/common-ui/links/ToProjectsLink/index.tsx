import LinkRoute from '@/components/ui/links/LinkRoute';
import { RoutePathsConstants } from '@/constants/routes/routes';

import styles from './styles.module.scss';

type ToProjectsLinkProps = {
  href?: string;
};

function ToProjectsLink({ href = RoutePathsConstants.PROJECTS }: ToProjectsLinkProps) {
  return (
    <LinkRoute
      type="button"
      backgroundColor="gray-4"
      className={styles.ToProjectsLink}
      textClassName={styles.ToProjectsLink__text}
      text="Show more Pre-orders"
      href={href}
    />
  );
}

export default ToProjectsLink;
