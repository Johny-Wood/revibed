import { useRef, useState } from 'react';

import classNames from 'classnames';

import slideAnimationsStyles from '@/assets/styles/animations/slide.module.scss';
import TransitionSwitchLayout from '@/components/layouts/TransitionLayouts/TransitionSwitchLayout';
import { DesktopLayout, MobileLayout } from '@/components/layouts/ViewportLayouts';
import ButtonIcon from '@/components/ui/buttons/ButtonIcon';
import ComponentsCommonConstants from '@/constants/components/common';
import ViewportHook from '@/hooks/viewport/ViewportHook';
import CloseIcon from '@/icons/control/close/CloseIcon';

import styles from './styles.module.scss';

function RetractableMenu({ className, buttonText = '', buttonIcon, withMenu = true, children }) {
  const { isNotDesktop } = ViewportHook();

  const [showedRetractableMenu, setShowRetractableMenu] = useState(false);
  const menuRef = useRef(null);

  const checkClickTarget = (e) => {
    if (!withMenu) {
      return;
    }

    if (!!menuRef.current && !menuRef.current.contains(e.target)) {
      if (isNotDesktop) {
        e.stopPropagation();
        e.preventDefault();
        e.stopImmediatePropagation();
      }

      setShowRetractableMenu(false);

      document.body.removeEventListener('click', checkClickTarget, false);
    }
  };

  const onToggleMenu = (isShown) => {
    if (!withMenu) {
      return;
    }

    setShowRetractableMenu(isShown);

    if (!showedRetractableMenu) {
      document.body.addEventListener('click', checkClickTarget, false);
    } else {
      document.body.removeEventListener('click', checkClickTarget, false);
    }
  };

  return (
    <div className={classNames(styles.retractable, className)}>
      {withMenu && (
        <MobileLayout>
          <ButtonIcon
            className={styles.retractable__button}
            style={{ minWidth: 'auto' }}
            transparent
            size={ComponentsCommonConstants.Size.SMALL35}
            color="gray-3"
            iconPosition="left"
            onClick={() => onToggleMenu(true)}
            text={buttonText}
          >
            {buttonIcon}
          </ButtonIcon>
        </MobileLayout>
      )}
      <div className={styles.retractable__menu}>
        <MobileLayout>
          <TransitionSwitchLayout
            duration={300}
            isShown={showedRetractableMenu}
            animationClassNames={{
              enter: slideAnimationsStyles.slideToLeftAnimationEnter,
              enterActive: slideAnimationsStyles.slideToLeftAnimationEnter_active,
              exit: slideAnimationsStyles.slideToLeftAnimationExit,
              exitActive: slideAnimationsStyles.slideToLeftAnimationExit_active,
            }}
          >
            <div className={styles.retractable__content} ref={menuRef}>
              <div className={styles.retractable__header}>
                {withMenu && (
                  <ButtonIcon
                    icon={CloseIcon}
                    type="button_string"
                    className={styles.retractable__close}
                    onClick={() => onToggleMenu(false)}
                  />
                )}
              </div>
              {children}
            </div>
          </TransitionSwitchLayout>
        </MobileLayout>
        <DesktopLayout>{children}</DesktopLayout>
      </div>
    </div>
  );
}

export default RetractableMenu;
