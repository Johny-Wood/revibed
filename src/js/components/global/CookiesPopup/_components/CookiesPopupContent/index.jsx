import classNames from 'classnames';

import popupAnimation from '@/assets/styles/animations/popup.module.scss';
import CookiesPolicyLink from '@/components/common-ui/links/terms/CookiesPolicyLink';
import TransitionSwitchLayout from '@/components/layouts/TransitionLayouts/TransitionSwitchLayout';
import Button from '@/components/ui/buttons/Button';
import ButtonIcon from '@/components/ui/buttons/ButtonIcon';
import { CommonVariablesConstants } from '@/constants/common/variables';
import { MessagesSuccessConstants } from '@/constants/messages/success';
import CloseIcon from '@/icons/control/close/CloseIcon';
import { setCookieUtil } from '@/utils/cookiesUtil';

import styles from './styles.module.scss';

function CookiesPopupContent({ shown, closePopup }) {
  return (
    <TransitionSwitchLayout
      isShown={shown}
      animationClassNames={{
        enter: popupAnimation.onlyPopupAnimationEnter,
        enterActive: popupAnimation.onlyPopupAnimationEnter_active,
        exit: popupAnimation.onlyPopupAnimationExit,
        exitActive: popupAnimation.onlyPopupAnimationExit_active,
      }}
    >
      <div className="only-popup">
        <div className={classNames(styles.popupCookies, 'popup-animate')}>
          <div className={styles.popupCookies__wrapper}>
            <p className={classNames([styles.popupCookies__infoText, 't-size_12'])}>
              {MessagesSuccessConstants.COOKIE}
              &nbsp;
              <CookiesPolicyLink color="c-blue" />.
            </p>
            <div className={styles.popupCookies__button}>
              <Button
                text="Accept"
                className={styles.button}
                onClick={() => {
                  closePopup();
                  setCookieUtil(CommonVariablesConstants.CONFIRM_COOKIES, true, {
                    expires: new Date(2222, 0),
                  });
                }}
              />
              <ButtonIcon
                type="button_string"
                aria-label="close cookies message"
                icon={CloseIcon}
                className={styles.buttonClose}
                onClick={closePopup}
              />
            </div>
          </div>
        </div>
      </div>
    </TransitionSwitchLayout>
  );
}

export default CookiesPopupContent;
