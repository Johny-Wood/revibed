import UserControl from '@/components/global/Header/_components/UserControlBar/_compoenents/UserControl';
import { DesktopLayout } from '@/components/layouts/ViewportLayouts';
import CreateProjectLink from '@/components/projects/Project/_components/buttons/CreateProjectLink';

import styles from './styles.module.scss';

function UserControlBar() {
  return (
    <div className={styles.userControlBar}>
      <div className={styles.userControlBar__item}>
        <UserControl />
      </div>
      <DesktopLayout>
        <div className={styles.userControlBar__item}>
          <CreateProjectLink withIcon gtmAttribute="start_project_header" />
        </div>
      </DesktopLayout>
    </div>
  );
}

export default UserControlBar;
