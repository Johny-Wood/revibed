import classNames from 'classnames';

import newMobileMenuAnimation from '@/assets/styles/animations/new-mobile-menu.module.scss';
import DropDownMenuButton from '@/components/common/DropDownMenu/_components/DropDownMenuButton';
import DropDownMenuContent from '@/components/common/DropDownMenu/_components/DropDownMenuContent';
import ClosedOnClickLayout from '@/components/layouts/ClosedOnClickLayout';

import styles from './styles.module.scss';

function DropDownMenu({
  className,
  itemClassName,
  dropDownMenuListClass,
  list = [],
  withToggleArrow,
  button: dropDownButton,
  buttonProps = {},
}) {
  const dropDownMenuItemClass = classNames(styles.dropDownMenu__item, itemClassName);

  return (
    <ClosedOnClickLayout
      withDarkBackgroundOverlay={false}
      animationDuration={240}
      animationClassNames={{
        enter: newMobileMenuAnimation.newMobileMenuAnimationEnter,
        enterActive: newMobileMenuAnimation.newMobileMenuAnimationEnter_active,
        exit: newMobileMenuAnimation.newMobileMenuAnimationExit,
        exitActive: newMobileMenuAnimation.newMobileMenuAnimationExit_active,
      }}
      className={classNames(styles.dropDownMenu, className)}
      button={DropDownMenuButton}
      buttonProps={{
        withToggleArrow,
        dropDownButton,
        dropDownButtonProps: buttonProps,
      }}
    >
      <DropDownMenuContent
        dropDownMenuListClass={dropDownMenuListClass}
        dropDownMenuItemClass={dropDownMenuItemClass}
        list={list}
      />
    </ClosedOnClickLayout>
  );
}

export default DropDownMenu;
