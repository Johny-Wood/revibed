import type { PropsWithChildren } from 'react';
import { memo } from 'react';

import { CSSTransition, SwitchTransition } from 'react-transition-group';
import type { CSSTransitionClassNames } from 'react-transition-group/CSSTransition';

type TransitionSwitchLayoutProps = PropsWithChildren & {
  id?: string | number;
  name?: string;
  duration?: number;
  isShown?: boolean;
  transitionKey?: string;
  animationClassNames?: CSSTransitionClassNames;
};

const TransitionSwitchLayout = memo(
  ({
    id,
    name = 'fade',
    duration = 300,
    isShown,
    transitionKey = 'key',
    animationClassNames,

    children,
  }: TransitionSwitchLayoutProps) => (
    <SwitchTransition>
      <CSSTransition
        key={`animation-${id}-${name}-${transitionKey}-${isShown ? 'showed' : 'not-showed'}`}
        timeout={{
          appear: 0,
          enter: isShown ? duration : 0,
          exit: isShown ? duration : 0,
        }}
        classNames={animationClassNames || `${name}-${duration}-animation`}
      >
        {/* eslint-disable-next-line react/jsx-no-useless-fragment */}
        <>{isShown && children}</>
      </CSSTransition>
    </SwitchTransition>
  )
);

export default TransitionSwitchLayout;
