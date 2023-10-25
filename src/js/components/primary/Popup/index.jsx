import { useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import popupAnimation from '@/assets/styles/animations/popup.module.scss';
import TransitionSwitchLayout from '@/components/layouts/TransitionLayouts/TransitionSwitchLayout';
import PopupLayout from '@/components/primary/Popup/_components/PopupLayout';
import ComponentsCommonConstants from '@/constants/components/common';
import ViewportHook from '@/hooks/viewport/ViewportHook';

function Popup({ activePopupList, popupId, ...popupProps }) {
  const { isNotDesktop, width, height } = ViewportHook();

  const {
    popupId: firstActivePopupNotOnly = '',
    popupData: {
      animationClassNames = {
        enter: popupAnimation.popupAnimationEnter,
        enterActive: popupAnimation.popupAnimationEnter_active,
        enterDone: popupAnimation.popupAnimationEnter_done,
        exit: popupAnimation.popupAnimationExit,
        exitActive: popupAnimation.popupAnimationExit_active,
      },
    } = {},
  } = activePopupList[0] || {};

  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!shown && firstActivePopupNotOnly !== popupId) {
      return;
    }

    setShown(firstActivePopupNotOnly === popupId);
  }, [firstActivePopupNotOnly, popupId, shown]);

  return (
    <TransitionSwitchLayout isShown={shown} animationClassNames={animationClassNames}>
      <div className="popups_not_only">
        <PopupLayout isNotDesktop={isNotDesktop} width={width} height={height} popupId={popupId} {...popupProps} />
      </div>
    </TransitionSwitchLayout>
  );
}

Popup.defaultProps = {
  popupKey: null,
  headerText: null,
  size: ComponentsCommonConstants.Size.NORMAL,
  withClose: undefined,
  closeCallBack: () => {},
  textAlign: 'center',
  classCustom: null,
  popupInClassName: null,
  popupContentClassName: null,
  popupHeaderClassName: null,
};

Popup.propTypes = {
  popupId: PropTypes.string.isRequired,
  popupKey: PropTypes.string,
  headerText: PropTypes.string,
  size: PropTypes.string,
  withClose: PropTypes.bool,
  closeCallBack: PropTypes.func,
  textAlign: PropTypes.oneOf(['left', 'center']),
  classCustom: PropTypes.string,
  popupInClassName: PropTypes.string,
  popupContentClassName: PropTypes.string,
  popupHeaderClassName: PropTypes.string,
};

export default connect((state) => ({
  activePopupList: state.PopupReducer.activePopupList,
}))(Popup);
