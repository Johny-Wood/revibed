import classNames from 'classnames';
import PropTypes from 'prop-types';

import TopUpBalanceButton from '@/components/common-ui/buttons/TopUpBalanceButton';
import { MessagesErrorConstants } from '@/constants/messages/error';
import { PopupProjectIdsConstants } from '@/constants/popups/id';

import styles from './styles.module.scss';

import WarningPopup from '../../common/WarningPopup';

function InsufficientFundsPopup({
  popupId = PopupProjectIdsConstants.InsufficientFundsPopup,
  popupData: { closeCallBack, withTopUp = true },
  popupCloseCallBack,

  closePopup,
}) {
  return (
    <WarningPopup
      popupId={popupId}
      popupTitle={MessagesErrorConstants.INSUFFICIENT_FUNDS_TITLE}
      closeCallBack={closeCallBack || popupCloseCallBack}
      withButtonOk={!withTopUp}
      popupText={withTopUp ? MessagesErrorConstants.INSUFFICIENT_FUNDS_TOP_UP : MessagesErrorConstants.INSUFFICIENT_FUNDS}
    >
      {withTopUp && (
        <TopUpBalanceButton
          type="button"
          className={classNames('primary', styles.InsufficientFundsPopup__topUpButton)}
          transparent={false}
          text="Top Up"
          onClick={() => closePopup(popupId)}
        />
      )}
    </WarningPopup>
  );
}

InsufficientFundsPopup.defaultProps = {
  popupCloseCallBack: () => {},
};

InsufficientFundsPopup.propTypes = {
  popupCloseCallBack: PropTypes.func,
};

export default InsufficientFundsPopup;
