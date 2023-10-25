import { Component } from 'react';

import classNames from 'classnames';
import { connect } from 'react-redux';

import AuthFooter from '@/components/forms/auth/_components/AuthFooter';
import AuthFormLayout from '@/components/forms/auth/_components/AuthFormLayout';
import Button from '@/components/ui/buttons/Button';
import Input from '@/components/ui/inputs/Input';
import { CommonErrorMessages } from '@/constants/common/errorsMessage';
import { CommonRegExpConstants } from '@/constants/common/regExp';
import { MessagesErrorConstants } from '@/constants/messages/error';
import { PopupCommonIdsConstants, PopupPasswordIdsConstants } from '@/constants/popups/id';
import { RoutePathsConstants } from '@/constants/routes/routes';
import { resetPasswordRequestAction } from '@/redux-actions/auth/resetPasswordActions';
import { showPopupAction } from '@/redux-actions/components/popupActions';
import NextRouter from '@/services/NextRouter';
import { handleErrorUtil } from '@/utils/apiUtils';
import { changeInputHandler, pressEnterKeyInputHandler, validateField } from '@/utils/inputHandlersUtil';
import { ValidateBadRequestUtil, ValidateMinLengthUtil, ValidateRegularTestUtil } from '@/utils/validate/inputCheckValidate';

import authFormStyles from '../styles.module.scss';

class NewPasswordForm extends Component {
  constructor(props) {
    super(props);

    this.changeInputHandler = changeInputHandler.bind(this);
    this.validateField = validateField.bind(this);
    this.badRequest = ValidateBadRequestUtil.bind(this);

    this.state = {
      token: props.resetToken,

      password: '',
      passwordError: false,
      passwordErrorMsg: '',

      passwordConfirm: '',
      passwordConfirmError: false,
      passwordConfirmErrorMsg: '',
    };
  }

  disabledNewPassword = () => {
    const { resetPasswordInProcess } = this.props;
    const {
      password,
      passwordError,

      passwordConfirm,
      passwordConfirmError,
    } = this.state;

    return (
      resetPasswordInProcess ||
      !password ||
      !passwordConfirm ||
      password !== passwordConfirm ||
      passwordError ||
      passwordConfirmError ||
      !ValidateRegularTestUtil(password, CommonRegExpConstants.PASSWORD_VALIDATE) ||
      !ValidateMinLengthUtil(password, CommonErrorMessages.PASSWORD_MIN_LENGTH) ||
      !ValidateMinLengthUtil(passwordConfirm, CommonErrorMessages.PASSWORD_MIN_LENGTH)
    );
  };

  onNewPassword = () => {
    const { resetPasswordRequest, showPopup } = this.props;
    const { password, token } = this.state;

    if (this.disabledNewPassword()) {
      return;
    }

    resetPasswordRequest({
      newPassword: password,
      token,
    })
      .then(() => {
        showPopup(PopupPasswordIdsConstants.ResetPasswordSuccessPopup);
        NextRouter.getInstance().router.push(RoutePathsConstants.MY_PROJECTS);
      })
      .catch(({ error, payload: { errorField } = {} }) => {
        if (error) {
          handleErrorUtil(error, {
            BAD_REQUEST: () => {
              this.badRequest(errorField);
            },
            RESET_PASSWORD_TOKEN_INVALID: () => {
              showPopup(PopupCommonIdsConstants.WarningPopup, {
                text: MessagesErrorConstants.TOKEN_INVALID,
              });
            },
          });
        }
      });
  };

  render() {
    const {
      password,
      passwordError,
      passwordErrorMsg,

      passwordConfirm,
      passwordConfirmError,
      passwordConfirmErrorMsg,
    } = this.state;

    const { resetPasswordInProcess } = this.props;

    return (
      <AuthFormLayout title="New Password...">
        <>
          <div className={classNames([authFormStyles.authForm__intro, 't-center'])}>
            <p className={authFormStyles.authForm__intro__text}>Enter your new password</p>
          </div>
          <div className={authFormStyles.authForm__inputs}>
            <Input
              id="password"
              label="New password"
              type="password"
              value={password}
              invalid={passwordError}
              invalidMessage={passwordErrorMsg}
              onChange={this.changeInputHandler}
              onBlur={(e) => {
                this.validateField(e, {
                  fieldIsValid: (value) => ValidateRegularTestUtil(value, CommonRegExpConstants.PASSWORD_VALIDATE),
                  invalidMessage: CommonErrorMessages.PASSWORD_PATTERN,
                  validateEmptyField: true,
                });

                this.validateField(e, {
                  fieldIsValid: (value) => ValidateMinLengthUtil(value, CommonErrorMessages.PASSWORD_MIN_LENGTH),
                  invalidMessage: CommonErrorMessages.PASSWORD_MIN_LENGTH_ERROR,
                  validateEmptyField: true,
                });
              }}
              onKeyDown={(e) => pressEnterKeyInputHandler(e, this.onSignInRequest)}
            />
            <Input
              id="passwordConfirm"
              label="Confirm new password"
              type="password"
              value={passwordConfirm}
              invalid={passwordConfirmError}
              invalidMessage={passwordConfirmErrorMsg}
              onChange={this.changeInputHandler}
              onBlur={(e) => {
                this.validateField(e, {
                  fieldIsValid: (value) => value && password === value,
                  invalidMessage: CommonErrorMessages.REPEAT_PASSWORD_ERROR,
                  validateEmptyField: true,
                });

                this.validateField(e, {
                  fieldIsValid: (value) => ValidateMinLengthUtil(value, CommonErrorMessages.PASSWORD_MIN_LENGTH),
                  invalidMessage: CommonErrorMessages.PASSWORD_MIN_LENGTH_ERROR,
                  validateEmptyField: true,
                });
              }}
              onKeyDown={(e) => pressEnterKeyInputHandler(e, this.onNewPassword)}
            />
          </div>
          <div className={classNames([authFormStyles.authForm__buttonBlock, 'm-top-25'])}>
            <Button
              text="Set New Password"
              isInProcess={resetPasswordInProcess}
              onClick={() => this.onNewPassword()}
              disabled={this.disabledNewPassword()}
            />
          </div>
          <AuthFooter
            isCenter
            button={{
              buttonHref: RoutePathsConstants.SIGN_UP,
              buttonText: 'Create new account!',
              buttonClass: 'c-blue t-bold',
            }}
          />
        </>
      </AuthFormLayout>
    );
  }
}

export default connect(
  (state) => ({
    resetPasswordInProcess: state.ResetPasswordReducer.resetPasswordInProcess,
  }),
  (dispatch) => ({
    showPopup: (popupId, popupData = {}, closeOtherPopups = true) => {
      dispatch(showPopupAction(popupId, popupData, closeOtherPopups));
    },
    resetPasswordRequest: (params) => resetPasswordRequestAction(params)(dispatch),
  })
)(NewPasswordForm);
