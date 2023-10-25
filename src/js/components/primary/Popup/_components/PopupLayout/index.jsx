import { Component, createRef } from 'react';

import classNames from 'classnames';
import Scrollbar from 'react-scrollbars-custom';

import PopupHeader from '@/components/primary/Popup/_components/PopupHeader';
import { CommonScrollbarLocationsConstants } from '@/constants/common/scrollBar';
import ComponentsCommonConstants from '@/constants/components/common';
import ScrollService from '@/services/scroll/ScrollService';
import { covertPx2RemUtil } from '@/utils/covertPx2RemUtil';

import styles from './styles.module.scss';

class PopupLayout extends Component {
  constructor(props) {
    super(props);

    this.scrollBarRef = createRef();

    ScrollService.initialize({
      scrollBarName: CommonScrollbarLocationsConstants.POPUP_SCROLL,
      scrollBarRef: this.scrollBarRef,
    });
  }

  render() {
    const {
      closeCallBack = () => {},
      popupId,
      popupKey = popupId,
      classCustom = '',
      headerText = '',
      size = ComponentsCommonConstants.Size.NORMAL,
      withClose,
      maxWidth = size !== ComponentsCommonConstants.Size.LARGE ? 400 : 500,
      textAlign = 'center',
      width,
      height,
      isNotDesktop,
      overflowVisible,
      popupInClassName,
      popupContentClassName,
      popupHeaderClassName,

      children,
    } = this.props;

    return (
      <div className={classNames(styles.popup, 'popup-animate')}>
        <Scrollbar
          ref={this.scrollBarRef}
          style={{
            width,
            height,
          }}
          className={styles.popupScroll}
          mobileNative={isNotDesktop}
          noScrollX
        >
          <div
            className={classNames(
              styles.popupBlock,
              size === 'large' && styles.popupBlock_large,
              textAlign === 'center' && styles.popupBlock_text_center,
              textAlign === 'left' && styles.popupBlock_text_left,
              popupId,
              classCustom,
              'popup-block'
            )}
            style={{ minHeight: height }}
          >
            <div
              className={classNames(styles.popupIn, overflowVisible && styles.popupIn_visible, popupInClassName, 'popup-in')}
              style={{
                maxWidth: covertPx2RemUtil(maxWidth),
              }}
            >
              <PopupHeader
                className={popupHeaderClassName}
                withClose={withClose}
                popupKey={popupKey || popupId}
                text={headerText}
                closeCallBack={closeCallBack}
              />
              <div className={classNames(styles.popupContent, popupContentClassName)}>{children}</div>
            </div>
          </div>
        </Scrollbar>
      </div>
    );
  }
}

export default PopupLayout;
