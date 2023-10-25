import LinkRoute from '@/components/ui/links/LinkRoute';
import { RoutePathsConstants } from '@/constants/routes/routes';

import styles from './styles.module.scss';

function ToProjectsLink({ href = RoutePathsConstants.PROJECTS }) {
  return (
    <LinkRoute
      type="button"
      className={styles.showMoreProjectsButton}
      text="Show more projects"
      rounded
      transparent
      href={href}
    />
  );
}

export default ToProjectsLink;
