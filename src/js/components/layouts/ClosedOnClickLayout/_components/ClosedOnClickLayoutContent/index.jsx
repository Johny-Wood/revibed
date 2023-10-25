import TransitionSwitchLayout from '@/components/layouts/TransitionLayouts/TransitionSwitchLayout';

function ClosedOnClickLayoutContent({ shownContent, animationName, animationDuration, animationClassNames, children }) {
  return (
    <TransitionSwitchLayout
      isShown={shownContent}
      name={animationName}
      duration={animationDuration}
      animationClassNames={animationClassNames}
    >
      {children}
    </TransitionSwitchLayout>
  );
}

export default ClosedOnClickLayoutContent;
