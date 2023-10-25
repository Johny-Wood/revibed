import TabsWrapper from '@/components/common/tabs/TabsWrapper';

import styles from './styles.module.scss';

function ProjectCardTabs({ tabs = [], activeTabDefault }) {
  return (
    <TabsWrapper
      className={styles.projectCardTabs}
      contentClassName={styles.projectCardTabs__tabContent}
      tabs={tabs}
      withOffsetBottom={false}
      activeTabDefault={activeTabDefault}
    />
  );
}

export default ProjectCardTabs;
