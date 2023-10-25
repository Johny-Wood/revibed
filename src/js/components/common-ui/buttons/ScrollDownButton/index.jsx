import classNames from 'classnames';
import PropTypes from 'prop-types';

import TransitionSwitchLayout from '@/components/layouts/TransitionLayouts/TransitionSwitchLayout';
import ButtonIcon from '@/components/ui/buttons/ButtonIcon';
import { CommonScrollbarLocationsConstants } from '@/constants/common/scrollBar';
import ArrowIcon from '@/icons/arrows/ArrowIcon';
import ScrollService from '@/services/scroll/ScrollService';

import styles from './styles.module.scss';

function ScrollDownButton({
  className,
  scrollBar = CommonScrollbarLocationsConstants.MAIN_SCROLL,
  sectionId,
  isShown,
  iconColor = 'white',
  duration,
  withAnimationDown,
  secondOffset,
  style = {},
}) {
  return (
    <div className={classNames([styles.buttonScrollDown__container, className])}>
      <TransitionSwitchLayout isShown={isShown} name="fade-to-top" duration={duration}>
        <ButtonIcon
          type="button_string"
          icon={ArrowIcon}
          iconColor={iconColor}
          className={classNames([styles.buttonScrollDown, withAnimationDown && styles.buttonScrollDown__animationStart])}
          style={style}
          onClick={() => {
            ScrollService.getInstance(scrollBar)
              .scrollToElement({
                sectionId,
                inRoute: true,
                duration: 800,
                secondOffset,
              })
              .then();
          }}
        />
      </TransitionSwitchLayout>
    </div>
  );
}

ScrollDownButton.propTypes = {
  sectionId: PropTypes.string.isRequired,
};

export default ScrollDownButton;
