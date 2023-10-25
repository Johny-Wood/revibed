import type { PropsWithChildren } from 'react';

import { CSSTransition } from 'react-transition-group';

type TransitionLayoutProps = PropsWithChildren & {
  isShown: boolean;
  name?: string;
  duration?: number;
};

function TransitionLayout({
  name = 'fade',
  duration = 300,
  isShown,

  children,
}: TransitionLayoutProps) {
  return (
    <CSSTransition in={isShown} timeout={duration} classNames={`${name}-${duration}-animation`}>
      {/* eslint-disable-next-line react/jsx-no-useless-fragment */}
      <>{isShown && children}</>
    </CSSTransition>
  );
}

export default TransitionLayout;
