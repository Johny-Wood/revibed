import type { PropsWithChildren } from 'react';

import classNames from 'classnames';

import styles from './styles.module.scss';

type HeaderNavLayoutProps = PropsWithChildren & {
  center?: boolean;
};

function HeaderNavLayout({ center, children }: HeaderNavLayoutProps) {
  return <div className={classNames(styles.headerNavLayout, center && styles.headerNavLayout_center)}>{children}</div>;
}

export default HeaderNavLayout;
