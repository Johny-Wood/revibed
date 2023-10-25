import classNames from 'classnames';
import parse from 'html-react-parser';
import PropTypes from 'prop-types';

import ClosePopupButton from '@/components/primary/Popup/_components/ClosePopupButton';

import styles from './styles.module.scss';

function PopupHeader({ popupKey, text, closeCallBack, withClose, className, children }) {
  return (
    <>
      <div className={classNames(styles.popupHeader, className)}>
        {(!!text || !!children) && (
          <div className={classNames(styles.popupHeader__title)}>
            {!!text && parse(text)}
            {!!children && children}
          </div>
        )}
      </div>
      {withClose && <ClosePopupButton popupKey={popupKey} closeCallBack={closeCallBack} />}
    </>
  );
}

PopupHeader.defaultProps = {
  text: '',
  popupKey: '',
  withClose: true,
  closeCallBack: () => {},
};

PopupHeader.propTypes = {
  popupKey: PropTypes.string,
  text: PropTypes.string,
  withClose: PropTypes.bool,
  closeCallBack: PropTypes.func,
};

export default PopupHeader;
