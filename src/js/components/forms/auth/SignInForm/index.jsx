import { Component } from 'react';

import { connect } from 'react-redux';

import AuthFooter from '@/components/forms/auth/_components/AuthFooter';
import AuthFormLayout from '@/components/forms/auth/_components/AuthFormLayout';
import PersonalInformationFields from '@/components/forms/personal/profile/PersonalInformationFields';
import Button from '@/components/ui/buttons/Button';
import LinkRoute from '@/components/ui/links/LinkRoute';
import { CommonErrorMessages } from '@/constants/common/errorsMessage';
import { CommonRegExpConstants } from '@/constants/common/regExp';
import { FormFieldsPersonalInformationConstants } from '@/constants/form/fields';
import { PointsTypesConstants } from '@/constants/points/type';
import { PopupEmailIdsConstants, PopupPersonalIdsConstants } from '@/constants/popups/id';
import { RoutePathsConstants } from '@/constants/routes/routes';
import { signInWithPasswordRequestAction } from '@/redux-actions/auth/authActions';
import { showPopupAction } from '@/redux-actions/components/popupActions';
import { loadPersonalActivePointsRequestAction } from '@/redux-actions/personal/activePointsActions';
import AuthRedirectorService from '@/services/auth/AuthRedirectorService';
import { handleErrorUtil } from '@/utils/apiUtils';
import { changeInputHandler, setInputError, validateField } from '@/utils/inputHandlersUtil';
import {
  ValidateBadRequestUtil,
  ValidateMaxLengthUtil,
  ValidateMinLengthUtil,
  ValidateRegularTestUtil,
} from '@/utils/validate/inputCheckValidate';

import authFormStyles from '../styles.module.scss';

class SignInForm extends Component {
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

      password: '',
      passwordError: false,
      passwordErrorMsg: '',
    };
  }

  disabledSignInRequest = () => {
    const { signInWithPasswordInProcess } = this.props;
    const {
      email,
      emailError,

      password,
      passwordError,
    } = this.state;

    return (
      signInWithPasswordInProcess ||
      !email ||
      !password ||
      emailError ||
      passwordError ||
      !ValidateRegularTestUtil(email, CommonRegExpConstants.EMAIL_VALIDATE) ||
      !ValidateRegularTestUtil(password, CommonRegExpConstants.PASSWORD_VALIDATE) ||
      !ValidateMaxLengthUtil(email, CommonErrorMessages.EMAIL_MAX_LENGTH) ||
      !ValidateMinLengthUtil(password, CommonErrorMessages.PASSWORD_MIN_LENGTH)
    );
  };

  onSignInRequest = () => {
    const { signInWithPassword, variablesList: { GOLDEN_COIN_PROMOTION_ENABLED } = {}, showPopup } = this.props;
    const { email, password } = this.state;

    if (this.disabledSignInRequest()) {
      return;
    }

    signInWithPassword(email, password)
      .then(() => {
        const { userInfo: { goldenCoinsCount } = {}, loadPersonalActivePointsRequest } = this.props;

        // analyticsAuthorizationPush("email");

        if (goldenCoinsCount > 0) {
          loadPersonalActivePointsRequest({
            type: PointsTypesConstants.GOLDEN_COIN,
          }).then(() => {
            if (!GOLDEN_COIN_PROMOTION_ENABLED) {
              return;
            }

            showPopup(PopupPersonalIdsConstants.GoldenCoinPopup, {}, false);
          });
        }

        AuthRedirectorService.clearAuthRedirector();
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
            INVALID_PASSWORD: () => {
              this.setInputError('password', CommonErrorMessages.INVALID_PASSWORD);
            },
            EMAIL_NOT_CONFIRMED: () => {
              this.setInputError('email', CommonErrorMessages.EMAIL_NOT_CONFIRMED);
              showPopup(PopupEmailIdsConstants.EmailMustBeConfirmedWarningPopup, {
                email,
              });
            },
            USER_BANNED: () => {
              this.setInputError('email', () => (
                <>
                  {CommonErrorMessages.USER_BANNED}
                  .&nbsp;
                  <LinkRoute href={RoutePathsConstants.CONTACT_US} translateKey="contactUs" className="underline" />
                </>
              ));
            },
          });
        }
      });
  };

  render() {
    const {
      email,
      emailError,
      emailErrorMsg,

      password,
      passwordError,
      passwordErrorMsg,
    } = this.state;

    const { signInWithPasswordInProcess } = this.props;

    return (
      <AuthFormLayout title="Log In">
        <>
          <div className={authFormStyles.authForm__inputs}>
            <PersonalInformationFields
              onChange={this.changeInputHandler}
              validateField={this.validateField}
              request={this.onSignInRequest}
              fields={[
                {
                  type: FormFieldsPersonalInformationConstants.email,
                  id: FormFieldsPersonalInformationConstants.email,
                  value: email,
                  invalid: emailError,
                  invalidMessage: emailErrorMsg,
                },
                {
                  type: FormFieldsPersonalInformationConstants.currentPassword,
                  id: FormFieldsPersonalInformationConstants.password,
                  value: password,
                  invalid: passwordError,
                  invalidMessage: passwordErrorMsg,
                },
              ]}
            />
          </div>
          <div className={authFormStyles.authForm__forgotPassword}>
            <LinkRoute
              href={{
                pathname: RoutePathsConstants.RESET_PASSWORD,
                query: email && !emailError ? { email } : {},
              }}
              text="Forgot Password?"
            />
          </div>
          <div className={authFormStyles.authForm__buttonBlock}>
            <Button
              text="Log In"
              isInProcess={signInWithPasswordInProcess}
              onClick={() => this.onSignInRequest()}
              disabled={this.disabledSignInRequest()}
            />
          </div>
          <AuthFooter
            message={{
              messageClass: 'c-gray-2',
              messageText: 'Don’t have an account?',
            }}
            button={{
              buttonClass: 'c-blue t-bold',
              buttonText: 'Sign Up',
              buttonHref: RoutePathsConstants.SIGN_UP,
            }}
          />
        </>
      </AuthFormLayout>
    );
  }
}

export default connect(
  (state) => ({
    variablesList: state.VariablesReducer.variablesList,
    userInfo: state.AuthReducer.userInfo,
    signInWithPasswordInProcess: state.AuthReducer.signInWithPasswordInProcess,
  }),
  (dispatch) => ({
    showPopup: (popupId, popupData = {}, closeOtherPopups = true) => {
      dispatch(showPopupAction(popupId, popupData, closeOtherPopups));
    },
    signInWithPassword: (email, password) => signInWithPasswordRequestAction(email, password)(dispatch),
    loadPersonalActivePointsRequest: (params = {}) => loadPersonalActivePointsRequestAction({ ...params, dispatch }),
  })
)(SignInForm);
