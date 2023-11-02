import type { PropsWithChildren } from 'react';

import classNames from 'classnames';

import styles from './styles.module.scss';

type RightsholdersFormGroupProps = PropsWithChildren & {
  description?: string;
};

export default function RightsholdersFormGroup({ description, children }: RightsholdersFormGroupProps) {
  return (
    <div className={classNames(styles.RightsholdersFormGroup)}>
      {!!description && <div className={classNames(styles.RightsholdersFormGroup__description)}>{description}</div>}
      {children}
    </div>
  );
}
