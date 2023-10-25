import BackButton from '@/components/common-ui/buttons/BackButton';
import ScrollbarLayout from '@/components/layouts/ScrollbarLayout';
import TransitionLayout from '@/components/layouts/TransitionLayouts/TransitionLayout';
import { MobileLayout } from '@/components/layouts/ViewportLayouts';
import ViewportHook from '@/hooks/viewport/ViewportHook';

import styles from './styles.module.scss';

function MobilePage({ isShown, children, closeMobilePage }) {
  const { width, height } = ViewportHook();

  return (
    <MobileLayout>
      <TransitionLayout isShown={isShown}>
        <div className={styles.mobilePage} style={{ height }}>
          <div className={styles.mobilePage__header}>
            <BackButton className={styles.mobilePage__buttonBack} routerType={false} onClick={closeMobilePage} />
          </div>
          <ScrollbarLayout width={width} maxHeight={height - 61}>
            <div className={styles.mobilePage__content}>{children}</div>
          </ScrollbarLayout>
        </div>
      </TransitionLayout>
    </MobileLayout>
  );
}

export default MobilePage;
