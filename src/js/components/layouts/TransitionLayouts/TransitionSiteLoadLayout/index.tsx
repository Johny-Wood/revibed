import type { PropsWithChildren } from 'react';

import { CSSTransition, SwitchTransition } from 'react-transition-group';

import styles from './styles.module.scss';

type TransitionSiteLoadLayoutProps = PropsWithChildren & {
  isShown: boolean;
};

function TransitionSiteLoadLayout({
  isShown,

  children,
}: TransitionSiteLoadLayoutProps) {
  return (
    <SwitchTransition>
      <CSSTransition
        key={`animation-${isShown ? 'site' : 'preload'}`}
        timeout={300}
        classNames={{
          enter: styles.fadeSiteAnimationEnter,
          enterActive: styles.fadeSiteAnimationEnter_active,
          exit: styles.fadeSiteAnimationExit,
          exitActive: styles.fadeSiteAnimationExit_active,
        }}
      >
        {/* eslint-disable-next-line react/jsx-no-useless-fragment */}
        <>{isShown && children}</>
      </CSSTransition>
    </SwitchTransition>
  );
}

export default TransitionSiteLoadLayout;
