import type { PropsWithChildren } from 'react';

import classNames from 'classnames';

import styles from './styles.module.scss';

type RightsholdersWrapperDashedBlockProps = PropsWithChildren;

export default function RightsholdersWrapperDashedBlock({ children }: RightsholdersWrapperDashedBlockProps) {
  return <div className={classNames(styles.RightsholdersWrapperDashedBlock)}>{children}</div>;
}
