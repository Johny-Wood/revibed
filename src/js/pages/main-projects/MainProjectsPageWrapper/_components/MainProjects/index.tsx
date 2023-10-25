import SecondaryTitle from '@/components/common/titles/SecondaryTitle';
import MainProjectsTabs from '@/pages/main-projects/MainProjectsPageWrapper/_components/MainProjectsTabs';

import styles from './styles.module.scss';

function MainProjects() {
  return (
    <div className={styles.MainProjects}>
      <SecondaryTitle title="Pre-orders" />
      <MainProjectsTabs />
    </div>
  );
}

export default MainProjects;
