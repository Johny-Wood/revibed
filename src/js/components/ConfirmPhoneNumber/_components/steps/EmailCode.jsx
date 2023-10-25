import { Component } from 'react';

import classNames from 'classnames';
import parse from 'html-react-parser';
import { connect } from 'react-redux';

import ConfirmTimer from '@/components/ConfirmPhoneNumber/ConfirmTimer';
import PopupHeader from '@/components/primary/Popup/_components/PopupHeader';
import Button from '@/components/ui/buttons/Button';
import Input from '@/components/ui/inputs/Input';
import { CommonMessagesConstants } from '@/constants/common/message';
import ConfirmPhoneStepsConstants from '@/constants/confirm/phone/step';
import { PopupPersonalIdsConstants } from '@/constants/popups/id';
import { showPopupAction } from '@/redux-actions/components/popupActions';
import { changeInputHandler, pressEnterKeyInputHandler } from '@/utils/inputHandlersUtil';

class EmailCode extends Component {
  constructor(props) {
    super(props);
    const { emailCodeError, emailCodeErrorMsg } = props;

    this.changeInputHandler = changeInputHandler.bind(this);

    this.state = {
      code: '',
      codeError: emailCodeError || false,
      codeErrorMsg: emailCodeErrorMsg || '',
    };
  }

  componentDidMount() {
    const {
      changeEmailNotFastLeft,
      confirmPhoneEmailRequestLastDate,
      variablesList: { CONFIRM_PHONE_REQUEST_INTERVAL_SECONDS } = {},
    } = this.props;
    const curDate = new Date().valueOf();
    const datePeriod = confirmPhoneEmailRequestLastDate - curDate;

    if (datePeriod >= 0 && datePeriod < CONFIRM_PHONE_REQUEST_INTERVAL_SECONDS * 1000) {
      changeEmailNotFastLeft(datePeriod);
    }
  }

  componentDidUpdate(prevProps) {
    const { emailCodeError, emailCodeErrorMsg } = this.props;
    const { emailCodeError: emailCodeErrorPrev, emailCodeErrorMsg: emailCodeErrorMsgPrev } = prevProps;

    if (emailCodeError !== emailCodeErrorPrev) {
      this.updateCodeError(emailCodeError);
    }

    if (emailCodeErrorMsg !== emailCodeErrorMsgPrev) {
      this.updateCodeErrorMsg(emailCodeErrorMsg);
    }
  }

  updateCodeError = (codeError) => {
    this.setState({
      codeError,
    });
  };

  updateCodeErrorMsg = (codeErrorMsg) => {
    this.setState({
      codeErrorMsg,
    });
  };

  disabledButton = () => {
    const { code, codeError } = this.state;

    return !code || codeError;
  };

  sendCode = () => {
    const { getConfirmPhoneCode, isChange, showPopup } = this.props;
    const { code } = this.state;
    const nextStep = ConfirmPhoneStepsConstants.CONFIRM_PHONE;

    if (this.disabledButton()) {
      return;
    }

    getConfirmPhoneCode({
      changeStep: true,
      nextStep,
      isEmail: true,
      code,
      successCallback: () => {
        if (isChange) {
          showPopup(PopupPersonalIdsConstants.PhoneNumberPopup, {
            isChange,
            stepId: nextStep,
          });
        }
      },
    });
  };

  disabledGetCodeAgain = () => {
    const { getConfirmPhoneCodeInProcess, emailNotFastLeft } = this.props;

    return getConfirmPhoneCodeInProcess || emailNotFastLeft > 0;
  };

  getCodeAgain = () => {
    const { getConfirmPhoneCode } = this.props;

    if (this.disabledGetCodeAgain()) {
      return;
    }

    getConfirmPhoneCode({ isEmailFast: true });
  };

  render() {
    const {
      phone = '',
      isNumberUpInfo,
      withCancel,
      withTitle,
      cancelConfirmPhoneCodeRequest,
      cancelConfirmPhoneCodeInProcess,
      emailNotFastLeft,
      changeEmailNotFastLeft,
      popupHeaderClassName,
    } = this.props;
    const { code, codeError, codeErrorMsg } = this.state;

    // eslint-disable-next-line prefer-regex-literals
    const number = () => <>{parse(phone.replace(new RegExp(' ', 'gi'), '&nbsp;'))}</>;

    return (
      <>
        {withTitle && (
          <PopupHeader className={popupHeaderClassName} withClose={false}>
            Email code
          </PopupHeader>
        )}
        <div className={classNames(['content-text  w-340_max', isNumberUpInfo ? 'c-black m-bottom-20' : 'm-bottom-30'])}>
          {isNumberUpInfo && <div className="m-bottom-20 m-top-20">You changed your number to +{number()}</div>}
          We&nbsp;sent you an&nbsp;email with the conformation code. Enter the code to&nbsp;continue the number change.&nbsp;
          {!isNumberUpInfo && (
            <>
              To&nbsp;confirm the number
              {number()}, we&nbsp;will make a&nbsp;reset call.
            </>
          )}
        </div>
        <Input
          id="code"
          label="Code"
          value={code}
          invalid={codeError}
          invalidMessage={codeErrorMsg}
          onChange={this.changeInputHandler}
          onKeyDown={(e) => pressEnterKeyInputHandler(e, this.sendCode)}
        />
        <Button
          text={CommonMessagesConstants.CONFIRM}
          className="m-top-5 w-100pct"
          disabled={this.disabledButton()}
          onClick={this.sendCode}
        />
        <div className="w-100pct m-top-20">
          <div className="w-100pct f-x-center f-y-end">
            <div className="f_direction_column">
              <span className="t-size_12">Didn&apos;t receive email?</span>
              <div className={classNames('f-y-center', withCancel || 'f_direction_column')}>
                <Button
                  type="button_string"
                  className="c-blue t-bold"
                  text="Send once again"
                  disabled={this.disabledGetCodeAgain()}
                  onClick={this.getCodeAgain}
                />
                {emailNotFastLeft > 0 && (
                  <div className={classNames(!withCancel || 'm-left-15')}>
                    <ConfirmTimer notFastLeft={emailNotFastLeft} changeNotFastLeft={changeEmailNotFastLeft} />
                  </div>
                )}
              </div>
            </div>
            {withCancel && (
              <Button
                type="button_string"
                className="c-gray-1 t-bold m-left-auto"
                text="Cancel"
                disabled={cancelConfirmPhoneCodeInProcess}
                onClick={() => {
                  if (cancelConfirmPhoneCodeInProcess) {
                    return;
                  }

                  cancelConfirmPhoneCodeRequest();
                }}
              />
            )}
          </div>
        </div>
      </>
    );
  }
}

export default connect(
  (state) => ({
    variablesList: state.VariablesReducer.variablesList,
    getConfirmPhoneCodeInProcess: state.ConfirmPhoneReducer.getConfirmPhoneCodeInProcess,
    confirmPhoneEmailRequestLastDate: state.ConfirmPhoneReducer.confirmPhoneEmailRequestLastDate,
  }),
  (dispatch) => ({
    showPopup: (popupId, popupData = {}, closeOtherPopups = true) => {
      dispatch(showPopupAction(popupId, popupData, closeOtherPopups));
    },
  })
)(EmailCode);
