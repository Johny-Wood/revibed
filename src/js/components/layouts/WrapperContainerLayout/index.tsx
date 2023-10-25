import type { PropsWithChildren } from 'react';
import { forwardRef } from 'react';

import classNames from 'classnames';

import styles from './styles.module.scss';

type WrapperContainerLayoutProps = PropsWithChildren & {
  direction?: 'row' | 'column';
  wrap?: 'nowrap' | 'wrap';
};

const WrapperContainerLayout = forwardRef<HTMLDivElement, WrapperContainerLayoutProps>(
  (
    {
      direction = 'row',
      wrap = 'nowrap',

      children,
    },
    ref
  ) => (
    <div
      ref={ref}
      className={classNames([
        styles.wrapperContainer,
        direction === 'row' && styles.wrapperContainer_direction_row,
        direction === 'column' && styles.wrapperContainer_direction_column,
        wrap === 'wrap' && styles.wrapperContainer_wrap,
        wrap === 'nowrap' && styles.wrapperContainer_nowrap,
      ])}
    >
      {children}
    </div>
  )
);

WrapperContainerLayout.displayName = 'WrapperContainerLayout';

export default WrapperContainerLayout;
