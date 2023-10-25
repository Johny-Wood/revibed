import type { PropsWithChildren } from 'react';
import { forwardRef } from 'react';

import classNames from 'classnames';

import BackButton from '@/components/common-ui/buttons/BackButton';
import Preloader from '@/components/ui/Preloader';

import styles from './styles.module.scss';

type SiteWrapperLayoutProps = PropsWithChildren & {
  withPadding?: boolean;
  withYPadding?: boolean;
  withBackButton?: boolean;
  preloadInProcess?: boolean;
  firstInPage?: boolean;
  withoutBottomPadding?: boolean;
  direction?: 'column' | 'row';
  name?: string;
  className?: string;
};

const SiteWrapperLayout = forwardRef<HTMLDivElement, SiteWrapperLayoutProps>(
  (
    {
      withPadding = true,
      withYPadding = true,
      name,
      withBackButton,
      withoutBottomPadding,
      direction = withBackButton ? 'column' : 'row',
      preloadInProcess,
      firstInPage,

      className,

      children,
    },
    ref
  ) => (
    <div
      ref={ref}
      className={classNames(
        styles.siteWrapper,
        !withPadding && styles.siteWrapper_padding_false,
        !withYPadding && styles.siteWrapper_padding_y_false,
        withoutBottomPadding && styles.siteWrapper_padding_bottom_false,
        direction === 'row' && styles.siteWrapper_direction_row,
        direction === 'column' && styles.siteWrapper_direction_column,
        firstInPage && styles.siteWrapper_first_in_page,
        name,
        className
      )}
    >
      {withBackButton && <BackButton />}
      {children}
      <Preloader id={`site-wrapper-${name}`} isShown={preloadInProcess} opacity={1} duration={500} />
    </div>
  )
);

SiteWrapperLayout.displayName = 'SiteWrapperLayout';

export default SiteWrapperLayout;
