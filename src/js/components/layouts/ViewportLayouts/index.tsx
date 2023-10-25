import type { PropsWithChildren } from 'react';

import ViewportHook from '@/hooks/viewport/ViewportHook';

type ViewportProps = PropsWithChildren;

export function MobileLayout({ children }: ViewportProps) {
  const { isNotDesktop } = ViewportHook();

  return isNotDesktop && !!children ? children : null;
}

export function TabletLayout({ children }: ViewportProps) {
  const { isTablet } = ViewportHook();

  return isTablet && !!children ? children : null;
}

export function DesktopLayout({ children }: ViewportProps) {
  const { isNotDesktop } = ViewportHook();

  return isNotDesktop || !children ? null : children;
}
