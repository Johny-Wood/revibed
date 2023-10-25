import BlogLastArticlesWidget from '@/pages/blog/BlogLastArticlesWidget';
import TopUsersWidget from '@/pages/main-projects/MainProjectsPageWrapper/_components/TopUsersWidget';

import styles from './styles.module.scss';

const LiveBar = () => (
  <div className={styles.LiveBar}>
    <TopUsersWidget />
    <BlogLastArticlesWidget />
  </div>
);

export default LiveBar;
