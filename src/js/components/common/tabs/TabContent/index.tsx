import type { PropsWithChildren } from 'react';

import classNames from 'classnames';

import styles from './styles.module.scss';

type TabContentProps = PropsWithChildren & {
  withOffsetBottom?: boolean;
  className?: string;
};

function TabContent({ className, withOffsetBottom = true, children }: TabContentProps) {
  return (
    <div className={classNames(styles.tabContainer, className, withOffsetBottom && styles.tabContainer_offset_bottom)}>
      {children}
    </div>
  );
}

export default TabContent;
