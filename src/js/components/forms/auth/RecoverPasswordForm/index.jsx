import { Component } from 'react';

import classNames from 'classnames';
import { connect } from 'react-redux';

import AuthFooter from '@/components/forms/auth/_components/AuthFooter';
import AuthFormLayout from '@/components/forms/auth/_components/AuthFormLayout';
import Button from '@/components/ui/buttons/Button';
import Input from '@/components/ui/inputs/Input';
import { CommonErrorMessages } from '@/constants/common/errorsMessage';
import { CommonRegExpConstants } from '@/constants/common/regExp';
import { PopupEmailIdsConstants } from '@/constants/popups/id';
import { RoutePathsConstants } from '@/constants/routes/routes';
import { resetPasswordLinkRequestAction } from '@/redux-actions/auth/resetPasswordActions';
import { showPopupAction } from '@/redux-actions/components/popupActions';
import NextRouter from '@/services/NextRouter';
import { handleErrorUtil } from '@/utils/apiUtils';
import { changeInputHandler, pressEnterKeyInputHandler, setInputError, validateField } from '@/utils/inputHandlersUtil';
import { ValidateBadRequestUtil, ValidateMaxLengthUtil, ValidateRegularTestUtil } from '@/utils/validate/inputCheckValidate';

import authFormStyles from '../styles.module.scss';

class RecoverPasswordForm extends Component {
  constructor(props) {
    super(props);

    this.changeInputHandler = changeInputHandler.bind(this);
    this.setInputError = setInputError.bind(this);
    this.validateField = validateField.bind(this);
    this.badRequest = ValidateBadRequestUtil.bind(this);

    const { email } = props;

    this.state = {
      email: email || '',
      emailError: false,
      emailErrorMsg: '',
    };
  }

  disabledRecoverPassword = () => {
    const { resetPasswordLinkInProcess } = this.props;
    const { email, emailError } = this.state;

    return (
      resetPasswordLinkInProcess ||
      !email ||
      emailError ||
      !ValidateRegularTestUtil(email, CommonRegExpConstants.EMAIL_VALIDATE) ||
      !ValidateMaxLengthUtil(email, CommonErrorMessages.EMAIL_MAX_LENGTH)
    );
  };

  onRecoverPassword = () => {
    const { resetPasswordLinkRequest, showPopup } = this.props;
    const { email } = this.state;

    if (this.disabledRecoverPassword()) {
      return;
    }

    resetPasswordLinkRequest(email)
      .then(() => {
        NextRouter.getInstance().router.push('/');
        showPopup(PopupEmailIdsConstants.ResetPasswordPopup);
      })
      .catch(({ error, payload: { errorField } = {} }) => {
        if (error) {
          handleErrorUtil(error, {
            BAD_REQUEST: () => {
              this.badRequest(errorField);
            },
            NO_SUCH_USER: () => {
              this.setInputError('email', CommonErrorMessages.NO_SUCH_USER);
            },
            EMAIL_NOT_CONFIRMED: () => {
              this.setInputError('email', CommonErrorMessages.EMAIL_NOT_CONFIRMED);
              showPopup(PopupEmailIdsConstants.EmailMustBeConfirmedWarningPopup, {
                email,
              });
            },
          });
        }
      });
  };

  render() {
    const { email, emailError, emailErrorMsg } = this.state;

    const { resetPasswordLinkInProcess } = this.props;

    return (
      <AuthFormLayout title="Forgot Password...">
        <div className={classNames([authFormStyles.authForm__intro, 't-center'])}>
          <p className={authFormStyles.authForm__intro__text}>
            Enter your email address
            <br />
            and we will send you a link to reset your password
          </p>
        </div>
        <div className={authFormStyles.authForm__inputs}>
          <Input
            id="email"
            label="Email"
            value={email}
            invalid={emailError}
            invalidMessage={emailErrorMsg}
            onChange={this.changeInputHandler}
            onBlur={(e) => {
              this.validateField(e, {
                fieldIsValid: (value) => ValidateRegularTestUtil(value, CommonRegExpConstants.EMAIL_VALIDATE),
                invalidMessage: CommonErrorMessages.EMAIL_PATTERN,
                validateEmptyField: true,
              });

              this.validateField(e, {
                fieldIsValid: (value) => ValidateMaxLengthUtil(value, CommonErrorMessages.EMAIL_MAX_LENGTH),
                invalidMessage: CommonErrorMessages.EMAIL_MAX_LENGTH_ERROR,
                validateEmptyField: true,
              });
            }}
            onKeyDown={(e) => pressEnterKeyInputHandler(e, this.onRecoverPassword)}
          />
        </div>
        <div className={classNames([authFormStyles.authForm__buttonBlock, 'm-top-25'])}>
          <Button
            text="Reset Password"
            isInProcess={resetPasswordLinkInProcess}
            onClick={() => this.onRecoverPassword()}
            disabled={this.disabledRecoverPassword()}
          />
        </div>
        <AuthFooter
          isCenter
          button={{
            buttonText: 'Create new account!',
            buttonClass: 'c-blue t-bold',
            buttonHref: RoutePathsConstants.SIGN_UP,
          }}
        />
      </AuthFormLayout>
    );
  }
}

export default connect(
  (state) => ({
    resetPasswordLinkInProcess: state.ResetPasswordReducer.resetPasswordLinkInProcess,
  }),
  (dispatch) => ({
    showPopup: (popupId, popupData = {}, closeOtherPopups = true) => {
      dispatch(showPopupAction(popupId, popupData, closeOtherPopups));
    },
    resetPasswordLinkRequest: (email) => resetPasswordLinkRequestAction(email)(dispatch),
  })
)(RecoverPasswordForm);
