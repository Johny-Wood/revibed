import { Component } from 'react';

import parse from 'html-react-parser';

import PhoneNumberInput from '@/components/common-ui/inputs/PhoneNumberInput';
import Timer from '@/components/common/Timer';
import PopupHeader from '@/components/primary/Popup/_components/PopupHeader';
import Button from '@/components/ui/buttons/Button';
import ErrorInputMessage from '@/components/ui/inputs/_components/ErrorInputMessage';
import { CommonErrorMessages } from '@/constants/common/errorsMessage';
import { CommonMessagesConstants } from '@/constants/common/message';
import { rewardFormatTypeUtil, rewardTypeFormatterUtil } from '@/utils/promo/promoUtils';

const getDescription = ({ isGoldenConfirm, isPromoActionConfirm, promoActionInfo }) => {
  if (isGoldenConfirm) {
    return (
      <>
        Use the <b className="c-golden-coin">Golden&nbsp;Koin</b> to&nbsp;
        <b>
          join your first project
          <br /> for free
        </b>
        , no&nbsp;matter it&rsquo;s value.
      </>
    );
  }

  if (isPromoActionConfirm) {
    const {
      provider: { name },
      reward: { amount, type },
    } = promoActionInfo;
    return (
      <>
        {name} is&nbsp;offering you
        {amount}
        &nbsp;
        {rewardTypeFormatterUtil({
          amount,
          type,
          format: rewardFormatTypeUtil.SIGN_UP,
        })}
        . Verify your phone number to&nbsp;start digging!
      </>
    );
  }

  return <>For security purposes, add a&nbsp;phone number to&nbsp;your account.</>;
};

class InputPhone extends Component {
  constructor(props) {
    super(props);

    this.isValidPhone = true;
    this.format = '';

    const { phoneError, phoneErrorMsg } = this.props;

    this.state = {
      phoneError: phoneError || false,
      phoneErrorMsg: phoneErrorMsg || '',
      phoneErrorMsgTime: '',
    };
  }

  componentDidUpdate(prevProps) {
    const { phoneError, phoneErrorMsg } = this.props;
    const { phoneError: phoneErrorPrev, phoneErrorMsg: phoneErrorMsgPrev } = prevProps;

    if (phoneError !== phoneErrorPrev) {
      this.setState({
        phoneError,
      });
    }

    if (phoneErrorMsg !== phoneErrorMsgPrev) {
      this.setState({
        phoneErrorMsg,
      });
    }
  }

  disabledButton = () => {
    const { phone, getConfirmPhoneCodeInProcess } = this.props;
    const { phoneError } = this.state;

    return getConfirmPhoneCodeInProcess || !phone || phoneError;
  };

  sendPhoneNumber = () => {
    const { getConfirmPhoneCode } = this.props;
    if (this.disabledButton()) {
      return;
    }

    getConfirmPhoneCode();
  };

  phoneIsValid = (isValid, format) => {
    this.isValidPhone = isValid;
    this.format = format;
  };

  onBlurPhone = (event) => {
    const { onBlur = () => {} } = this.props;

    if (!this.isValidPhone) {
      this.setState({
        phoneError: true,
        phoneErrorMsg: `${CommonErrorMessages.PHONE_WRONG}${this.format ? `. Valid format ${this.format}` : ''}`,
      });
    }

    onBlur(event);
  };

  onChangePhone = (event) => {
    const { onChange = () => {} } = this.props;

    this.setState({
      phoneError: false,
      phoneErrorMsg: '',
      phoneErrorMsgTime: '',
    });

    onChange(event);
  };

  render() {
    const {
      phone,
      isChange,
      isGoldenConfirm,
      promoActionInfo,
      isPromoActionConfirm = !!promoActionInfo,
      withTitle,
      title = isGoldenConfirm || isPromoActionConfirm
        ? `Add your phone number to&nbsp;claim your ${
            isPromoActionConfirm
              ? `free&nbsp;${rewardTypeFormatterUtil({
                  amount: promoActionInfo.reward.amount,
                  type: promoActionInfo.reward.type,
                  format: rewardFormatTypeUtil.SIGN_UP_POPUP_TITLE,
                })}`
              : 'Golden&nbsp;Koin'
          }`
        : `${isChange ? 'Change' : 'Add'} phone number`,
      getConfirmPhoneCodeInProcess,
      changeNotFastLeft,
      notFastLeft,
      popupHeaderClassName,
    } = this.props;

    const { phoneError, phoneErrorMsg, phoneErrorMsgTime } = this.state;

    return (
      <>
        {withTitle && (
          <PopupHeader className={popupHeaderClassName} withClose={false}>
            {parse(isChange || isGoldenConfirm || isPromoActionConfirm ? title : 'Complete registration')}
          </PopupHeader>
        )}
        <div className="content-text m-bottom-25 c-black">
          {getDescription({ isGoldenConfirm, isPromoActionConfirm, promoActionInfo })}
        </div>
        <PhoneNumberInput
          value={phone}
          invalid={phoneError}
          invalidMessage={phoneErrorMsg}
          onChange={this.onChangePhone}
          onBlur={this.onBlurPhone}
          callback={this.sendPhoneNumber}
          isValidCallback={this.phoneIsValid}
        />
        {notFastLeft > 0 && (
          <ErrorInputMessage invalidMessage={phoneErrorMsgTime} invalid>
            <Timer
              className="c-red t-size_10 f-inline m-left-5"
              endDate={new Date().valueOf() + notFastLeft}
              endDateCallback={() => changeNotFastLeft(0)}
              formats={['minutes', 'seconds']}
            />
          </ErrorInputMessage>
        )}
        <Button
          text={CommonMessagesConstants.CONFIRM}
          className="m-top-15 w-100pct"
          disabled={this.disabledButton()}
          isInProcess={getConfirmPhoneCodeInProcess}
          onClick={this.sendPhoneNumber}
        />
        {(isGoldenConfirm || isPromoActionConfirm) && (
          <div
            className="m-top-20 golden-coin-footer text_size_12 w-400_max b-center"
            style={{ marginLeft: 'auto', marginRight: 'auto' }}
          >
            Without phone verification, you will not be&nbsp;able to&nbsp;download music or&nbsp;withdraw money from your account.
            Commenting on&nbsp;projects is&nbsp;also restricted to&nbsp;verified users.
          </div>
        )}
      </>
    );
  }
}

export default InputPhone;
