import type { PropsWithChildren } from 'react';

import { CSSTransition, SwitchTransition } from 'react-transition-group';

import slideAnimationsStyles from '@/assets/styles/animations/slide.module.scss';

type TransitionDropDownLayoutProps = PropsWithChildren & {
  isShown: boolean;
};

function TransitionDropDownLayout({
  isShown,

  children,
}: TransitionDropDownLayoutProps) {
  return (
    <SwitchTransition>
      <CSSTransition
        timeout={200}
        classNames={{
          enter: slideAnimationsStyles.slideToBottomAnimationEnter,
          enterActive: slideAnimationsStyles.slideToBottomAnimationEnter_active,
          exit: slideAnimationsStyles.slideToBottomAnimationExit,
          exitActive: slideAnimationsStyles.slideToBottomAnimationExit_active,
        }}
        key={`animation-slide-to-bottom-${isShown ? 'in' : 'out'}`}
      >
        {/* eslint-disable-next-line react/jsx-no-useless-fragment */}
        <>{isShown && children}</>
      </CSSTransition>
    </SwitchTransition>
  );
}

export default TransitionDropDownLayout;
