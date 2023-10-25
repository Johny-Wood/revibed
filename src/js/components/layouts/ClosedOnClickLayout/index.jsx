import { useCallback, useEffect, useRef, useState } from 'react';

import classNames from 'classnames';
import { connect } from 'react-redux';

import ClosedOnClickLayoutContent from '@/components/layouts/ClosedOnClickLayout/_components/ClosedOnClickLayoutContent';
import ViewportHook from '@/hooks/viewport/ViewportHook';
import { toggleShowDarkBackgroundOverlayAction } from '@/redux-actions/components/darkBackgroundOverlayActions';
import { disableScrollAction } from '@/redux-actions/components/scrollActions';

function ClosedOnClickLayout({
  className,
  animationClassNames,
  animationName,
  animationDuration,
  withDarkBackgroundOverlay = true,
  button: Button,
  buttonProps = {},
  content: Content,
  contentProps = {},

  children,

  disableScroll,
  toggleShowDarkBackgroundOverlay,
}) {
  const { isNotDesktop } = ViewportHook();
  const layoutRef = useRef(null);

  const [shownContent, setShownContent] = useState(false);

  const onToggleMenu = ({ newShownContent }) => {
    setShownContent(newShownContent);
  };

  const checkClickTarget = useCallback(
    (e) => {
      if (!layoutRef.current || layoutRef.current.contains(e.target)) {
        return;
      }

      if (isNotDesktop) {
        e.stopPropagation();
        e.preventDefault();
        e.stopImmediatePropagation();
      }

      onToggleMenu({ newShownContent: false });
    },
    [isNotDesktop]
  );

  useEffect(() => {
    if (shownContent) {
      document.body.addEventListener('click', checkClickTarget, true);
    } else {
      document.body.removeEventListener('click', checkClickTarget, true);
    }
  }, [checkClickTarget, shownContent]);

  useEffect(() => {
    if (!isNotDesktop || !withDarkBackgroundOverlay) {
      return;
    }

    disableScroll({ isDisabled: shownContent });
    toggleShowDarkBackgroundOverlay({ isShown: shownContent });
  }, [shownContent, isNotDesktop, withDarkBackgroundOverlay, disableScroll, toggleShowDarkBackgroundOverlay]);

  return (
    <div ref={layoutRef} className={classNames([className, shownContent && 'shown'])}>
      {!!Content && <Content {...contentProps} />}
      {!!Button && (
        <Button
          {...buttonProps}
          shownContent={shownContent}
          onClick={() => {
            onToggleMenu({ newShownContent: !shownContent });
          }}
        />
      )}
      <ClosedOnClickLayoutContent
        shownContent={shownContent}
        animationName={animationName}
        animationDuration={animationDuration}
        animationClassNames={animationClassNames}
      >
        {children}
      </ClosedOnClickLayoutContent>
    </div>
  );
}

export default connect(
  () => ({}),
  (dispatch) => ({
    disableScroll: ({ isDisabled }) => {
      dispatch(disableScrollAction({ isDisabled }));
    },
    toggleShowDarkBackgroundOverlay: ({ isShown }) => {
      dispatch(toggleShowDarkBackgroundOverlayAction({ isShown }));
    },
  })
)(ClosedOnClickLayout);
