import { Component } from 'react';

import classNames from 'classnames';
import { connect } from 'react-redux';

import ConfirmSuccess from '@/components/ConfirmPhoneNumber/_components/steps/ConfirmSuccess';
import EmailCode from '@/components/ConfirmPhoneNumber/_components/steps/EmailCode';
import InputPhone from '@/components/ConfirmPhoneNumber/_components/steps/InputPhone';
import SmsCode from '@/components/ConfirmPhoneNumber/_components/steps/SmsCode';
import { CommonErrorMessages } from '@/constants/common/errorsMessage';
import { CommonVariablesConstants } from '@/constants/common/variables';
import ConfirmPhoneStepsConstants from '@/constants/confirm/phone/step';
import {
  cancelConfirmPhoneCodeRequestAction,
  changeConfirmPhoneEmailRequestLastDateAction,
  getConfirmPhoneCodeRequestAction,
} from '@/redux-actions/confirm/confirmPhoneActions';
import { handleErrorUtil } from '@/utils/apiUtils';
import { getCookieUtil, setCookieUtil } from '@/utils/cookiesUtil';
import { changeInputHandler, setInputError } from '@/utils/inputHandlersUtil';

import styles from './styles.module.scss';

class ConfirmPhoneNumber extends Component {
  constructor(props) {
    super(props);

    const { userInfo: { newTmpPhone } = {}, isSuccess } = props;

    const { phone } = props;

    this.setInputError = setInputError.bind(this);
    this.changeInputHandler = changeInputHandler.bind(this);

    this.state = {
      phone: phone || newTmpPhone || '',
      phoneError: false,
      phoneErrorMsg: '',

      notFastLeft: 0,
      emailNotFastLeft: 0,
      canGetCodeAgain: false,

      emailCodeError: false,
      emailCodeErrorMsg: '',

      isSuccess: isSuccess || false,
    };
  }

  changeNotFastLeft = (notFastLeft) => {
    this.setState({
      notFastLeft,
    });
  };

  changeEmailNotFastLeft = (emailNotFastLeft) => {
    this.setState({
      emailNotFastLeft,
    });
  };

  changeCanGetCodeAgain = (canGetCodeAgain) => {
    this.setState({
      canGetCodeAgain,
    });
  };

  getConfirmPhoneCode = ({ isFast, isEmail, isEmailFast, successCallback, code, type } = {}) => {
    const {
      getConfirmPhoneCodeInProcess,
      getConfirmPhoneCodeRequest,
      changeConfirmPhoneEmailRequestLastDate,
      variablesList: { CONFIRM_PHONE_REQUEST_INTERVAL_SECONDS } = {},
    } = this.props;
    const { phone } = this.state;

    const curDate = new Date().valueOf();
    const confirmPhoneCookies = getCookieUtil(CommonVariablesConstants.CONFIRM_PHONE_COOKIES);
    const { phone: phoneCookie, dateEnd } = confirmPhoneCookies ? JSON.parse(confirmPhoneCookies) : {};

    if (getConfirmPhoneCodeInProcess) {
      return;
    }

    if (
      phoneCookie === phone &&
      dateEnd - curDate >= 0 &&
      dateEnd - curDate < CONFIRM_PHONE_REQUEST_INTERVAL_SECONDS * 1000 &&
      !isFast &&
      !isEmail &&
      !isEmailFast
    ) {
      this.changeNotFastLeft(dateEnd - curDate);

      return;
    }

    getConfirmPhoneCodeRequest({
      value: isEmail && code ? code : `${phone.replace('+', '')}`,
      type,
    })
      .then((confirmByEmail) => {
        if (successCallback) {
          successCallback();
        }

        if (!isEmail && !isEmailFast) {
          this.setCookie();
          this.changeNotFastLeft(0);
          this.changeCanGetCodeAgain(false);
        }

        if (confirmByEmail || isEmailFast) {
          const newEmailNotFastLeft = CONFIRM_PHONE_REQUEST_INTERVAL_SECONDS * 1000;

          this.changeEmailNotFastLeft(newEmailNotFastLeft);
          changeConfirmPhoneEmailRequestLastDate(new Date().valueOf() + newEmailNotFastLeft);
        }
      })
      .catch(({ error = {}, payload: { left } = {} }) => {
        if (error) {
          handleErrorUtil(error, {
            PHONE_ALREADY_CONFIRMED: () => {
              this.setInputError('phone', CommonErrorMessages.PHONE_ALREADY_CONFIRMED);
            },
            PHONE_ALREADY_EXISTS: () => {
              this.setInputError('phone', CommonErrorMessages.PHONE_ALREADY_EXISTS);
            },
            CHANGE_PHONE_INVALID_CODE: () => {
              this.setState({
                emailCodeError: true,
                emailCodeErrorMsg: CommonErrorMessages.CONFIRM_PHONE_CODE_INVALID,
              });
            },
            NOT_SO_FAST: () => {
              this.changeNotFastLeft(left);
            },
          });
        }
      });
  };

  showPhoneError = (error) => {
    handleErrorUtil(error, {
      PHONE_ALREADY_CONFIRMED: () => {
        this.setInputError('phone', CommonErrorMessages.PHONE_ALREADY_CONFIRMED);
      },
      PHONE_ALREADY_EXISTS: () => {
        this.setInputError('phone', CommonErrorMessages.PHONE_ALREADY_EXISTS);
      },
    });
  };

  setCookie = () => {
    const { phone } = this.state;
    const { variablesList: { CONFIRM_PHONE_REQUEST_INTERVAL_SECONDS } = {} } = this.props;

    setCookieUtil(
      CommonVariablesConstants.CONFIRM_PHONE_COOKIES,
      JSON.stringify({
        phone,
        dateEnd: new Date().valueOf() + CONFIRM_PHONE_REQUEST_INTERVAL_SECONDS * 1000,
      }),
      { expires: 1 }
    );
  };

  changeSuccess = ({ isSuccess, callback = () => {} }) => {
    callback();
    this.setState({
      isSuccess,
    });
  };

  cancelConfirm = ({ callback = () => {} } = {}) => {
    const { cancelConfirmPhoneCodeInProcess, cancelConfirmPhoneCodeRequest } = this.props;

    if (cancelConfirmPhoneCodeInProcess) {
      return;
    }

    cancelConfirmPhoneCodeRequest().then(() => {
      callback();
    });
  };

  renderStep = () => {
    const {
      title,
      isChange,
      isNumberUpInfo,
      withCancel,
      withTitle,
      confirmSuccessCallback,
      userInfo: { confirmPhoneStep, phoneConfirmed } = {},
      cancelConfirmPhoneCodeInProcess,
      promoActionInfo,
      popupHeaderClassName,
    } = this.props;

    const {
      phone,
      notFastLeft,
      emailNotFastLeft,
      phoneError,
      phoneErrorMsg,
      emailCodeError,
      emailCodeErrorMsg,
      isSuccess,
      canGetCodeAgain,
    } = this.state;

    if (!confirmPhoneStep && !isSuccess) {
      return (
        <InputPhone
          title={title}
          withTitle={withTitle}
          popupHeaderClassName={classNames(popupHeaderClassName, styles.popupHeader)}
          isChange={isChange}
          phone={phone}
          phoneError={phoneError}
          phoneErrorMsg={phoneErrorMsg}
          promoActionInfo={promoActionInfo}
          onChange={this.changeInputHandler}
          changeNotFastLeft={this.changeNotFastLeft}
          getConfirmPhoneCode={this.getConfirmPhoneCode}
        />
      );
    }

    if (confirmPhoneStep === ConfirmPhoneStepsConstants.CONFIRM_BY_EMAIL) {
      return (
        <EmailCode
          withTitle={withTitle}
          popupHeaderClassName={classNames(popupHeaderClassName, styles.popupHeader)}
          phone={phone}
          isChange={isChange}
          isNumberUpInfo={isNumberUpInfo}
          withCancel={withCancel}
          emailNotFastLeft={emailNotFastLeft}
          emailCodeError={emailCodeError}
          emailCodeErrorMsg={emailCodeErrorMsg}
          cancelConfirmPhoneCodeInProcess={cancelConfirmPhoneCodeInProcess}
          changeEmailNotFastLeft={this.changeEmailNotFastLeft}
          getConfirmPhoneCode={this.getConfirmPhoneCode}
          showPhoneError={this.showPhoneError}
          cancelConfirmPhoneCodeRequest={this.cancelConfirm}
        />
      );
    }

    if (confirmPhoneStep === ConfirmPhoneStepsConstants.CONFIRM_PHONE) {
      return (
        <SmsCode
          withTitle={withTitle}
          popupHeaderClassName={classNames(popupHeaderClassName, styles.popupHeader)}
          isChange={isChange}
          notFastLeft={notFastLeft}
          canGetCodeAgain={canGetCodeAgain}
          cancelConfirmPhoneCodeInProcess={cancelConfirmPhoneCodeInProcess}
          getConfirmPhoneCode={this.getConfirmPhoneCode}
          changeCanGetCodeAgain={this.changeCanGetCodeAgain}
          changeNotFastLeft={this.changeNotFastLeft}
          showPhoneError={this.showPhoneError}
          cancelConfirmPhoneCodeRequest={this.cancelConfirm}
          changeSuccess={this.changeSuccess}
        />
      );
    }

    if (!confirmPhoneStep && phoneConfirmed && isSuccess) {
      return (
        <ConfirmSuccess
          confirmSuccessCallback={confirmSuccessCallback}
          popupHeaderClassName={classNames(popupHeaderClassName, styles.popupHeader)}
        />
      );
    }

    return null;
  };

  render() {
    const { isShown = true } = this.props;

    if (!isShown) {
      return null;
    }

    return <div className={styles.confirmPhone}>{this.renderStep()}</div>;
  }
}

export default connect(
  (state) => ({
    variablesList: state.VariablesReducer.variablesList,
    userInfo: state.AuthReducer.userInfo,
    getConfirmPhoneCodeInProcess: state.ConfirmPhoneReducer.getConfirmPhoneCodeInProcess,
    cancelConfirmPhoneCodeInProcess: state.ConfirmPhoneReducer.cancelConfirmPhoneCodeInProcess,
  }),
  (dispatch) => ({
    getConfirmPhoneCodeRequest: (params) => getConfirmPhoneCodeRequestAction(params, dispatch),
    cancelConfirmPhoneCodeRequest: () => cancelConfirmPhoneCodeRequestAction(dispatch),
    changeConfirmPhoneEmailRequestLastDate: (confirmPhoneEmailRequestLastDate) => {
      dispatch(changeConfirmPhoneEmailRequestLastDateAction(confirmPhoneEmailRequestLastDate));
    },
  })
)(ConfirmPhoneNumber);
