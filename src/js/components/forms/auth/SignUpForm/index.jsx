import { Component } from 'react';

import classNames from 'classnames';
import { connect } from 'react-redux';

import PrivacyPolicyLink from '@/components/common-ui/links/terms/PrivacyPolicyLink';
import TermsLink from '@/components/common-ui/links/terms/TermsLink';
import AuthFooter from '@/components/forms/auth/_components/AuthFooter';
import AuthFormLayout from '@/components/forms/auth/_components/AuthFormLayout';
import ReferralProgram from '@/components/forms/auth/SignUpForm/_components/ReferralProgram';
import PersonalInformationFields from '@/components/forms/personal/profile/PersonalInformationFields';
import Button from '@/components/ui/buttons/Button';
import CheckBox from '@/components/ui/inputs/CheckBox';
import { CommonErrorMessages } from '@/constants/common/errorsMessage';
import { CommonRegExpConstants } from '@/constants/common/regExp';
import { CommonVariablesConstants } from '@/constants/common/variables';
import { FormFieldsPersonalInformationConstants } from '@/constants/form/fields';
import { PopupEmailIdsConstants } from '@/constants/popups/id';
import { RoutePathsConstants } from '@/constants/routes/routes';
import { signUpRequestAction } from '@/redux-actions/auth/authActions';
import { showPopupAction } from '@/redux-actions/components/popupActions';
import AuthRedirectorService from '@/services/auth/AuthRedirectorService';
import { handleErrorUtil } from '@/utils/apiUtils';
import { getCookieUtil } from '@/utils/cookiesUtil';
import {
  changeCheckBoxHandler,
  changeInputHandler,
  pressEnterKeyInputHandler,
  setInputError,
  validateField,
} from '@/utils/inputHandlersUtil';
import {
  ValidateBadRequestUtil,
  ValidateMaxLengthUtil,
  ValidateMinLengthUtil,
  ValidateRegularTestUtil,
} from '@/utils/validate/inputCheckValidate';

import styles from './styles.module.scss';

import authFormStyles from '../styles.module.scss';

class SignUpForm extends Component {
  constructor(props) {
    super(props);

    this.changeInputHandler = changeInputHandler.bind(this);
    this.changeCheckBoxHandler = changeCheckBoxHandler.bind(this);
    this.validateField = validateField.bind(this);
    this.setInputError = setInputError.bind(this);
    this.badRequest = ValidateBadRequestUtil.bind(this);

    const { referralCode = '', email = '' } = props;
    const referralCodeFromCookie = getCookieUtil(CommonVariablesConstants.REFERRAL_CODE);

    this.state = {
      username: '',
      usernameError: false,
      usernameErrorMsg: '',

      email: email || '',
      emailError: false,
      emailErrorMsg: '',

      password: '',
      passwordError: false,
      passwordErrorMsg: '',

      passwordConfirm: '',
      passwordConfirmError: false,
      passwordConfirmErrorMsg: '',

      countryId: undefined,
      countryIdError: false,

      referralCode: referralCode || referralCodeFromCookie || '',
      referralCodeError: false,
      referralCodeErrorMsg: '',

      acceptRules: false,
      acceptRulesError: false,
      acceptRulesErrorMsg: '',

      haveReferralCode: !!referralCode || !!referralCodeFromCookie || false,
      referralUser: {},
    };
  }

  changeCountry = (country) => {
    const { id } = country;

    this.setState({
      countryId: id,
      countryIdError: false,
    });
  };

  disabledSignUpRequest = () => {
    const { signUpInProcess } = this.props;
    const {
      acceptRules,

      username,
      usernameError,

      email,
      emailError,

      password,
      passwordError,

      passwordConfirm,
      passwordConfirmError,

      countryId,
      countryIdError,

      referralCodeError,
    } = this.state;

    return (
      signUpInProcess ||
      !acceptRules ||
      !username ||
      !email ||
      !password ||
      !passwordConfirm ||
      password !== passwordConfirm ||
      !countryId ||
      usernameError ||
      emailError ||
      passwordError ||
      passwordConfirmError ||
      countryIdError ||
      referralCodeError ||
      !ValidateRegularTestUtil(username, CommonRegExpConstants.NAME_VALIDATE) ||
      !ValidateRegularTestUtil(email, CommonRegExpConstants.EMAIL_VALIDATE) ||
      !ValidateRegularTestUtil(password, CommonRegExpConstants.PASSWORD_VALIDATE) ||
      !ValidateMaxLengthUtil(username, CommonErrorMessages.USER_NAME_MAX_LENGTH) ||
      !ValidateMaxLengthUtil(email, CommonErrorMessages.EMAIL_MAX_LENGTH) ||
      !ValidateMinLengthUtil(password, CommonErrorMessages.PASSWORD_MIN_LENGTH) ||
      !ValidateMinLengthUtil(passwordConfirm, CommonErrorMessages.PASSWORD_MIN_LENGTH)
    );
  };

  onSignUpRequest = () => {
    const { signUpRequest, languageSelected: { id: languageId } = {}, showPopup } = this.props;
    const { username, email, password, countryId, referralCode, acceptRules } = this.state;

    if (this.disabledSignUpRequest()) {
      return;
    }

    signUpRequest({
      username,
      email,
      password,
      countryId,
      acceptRules,
      languageId,
      referralCode: referralCode || undefined,
    })
      .then(() => {
        showPopup(PopupEmailIdsConstants.EmailSentToPopup);

        this.setState({
          acceptRules: false,
          username: '',
          email: '',
          password: '',
          passwordConfirm: '',
          referralCode: '',
          countryId: undefined,
        });

        AuthRedirectorService.clearAuthRedirector();
      })
      .catch(({ error, payload: { errorField } = {} }) => {
        if (error) {
          handleErrorUtil(error, {
            BAD_REQUEST: () => {
              this.badRequest(errorField);
            },
            EMAIL_ALREADY_EXISTS: () => {
              this.setInputError('email', CommonErrorMessages.EMAIL_ALREADY_EXISTS);
            },
            COUNTRY_NOT_FOUND: () => {
              this.setInputError('country', CommonErrorMessages.COUNTRY_NOT_FOUND);
            },
            REFERRAL_CODE_NOT_FOUND: () => {
              this.setInputError('referralCode', CommonErrorMessages.REFERRAL_CODE_NOT_FOUND);
            },
            PROMO_ACTION_NOT_ACTIVE: () => {
              this.setInputError('referralCode', CommonErrorMessages.PROMO_ACTION_NOT_ACTIVE);
            },
            USERNAME_ALREADY_EXISTS: () => {
              this.setInputError('username', CommonErrorMessages.USERNAME_ALREADY_EXISTS);
            },
          });
        }
      });
  };

  changeReferralUser = (referralUser = {}) => {
    this.setState({ referralUser });
  };

  render() {
    const {
      username,
      usernameError,
      usernameErrorMsg,

      email,
      emailError,
      emailErrorMsg,

      password,
      passwordError,
      passwordErrorMsg,

      passwordConfirm,
      passwordConfirmError,
      passwordConfirmErrorMsg,

      countryId,

      acceptRules,
      acceptRulesError,
      acceptRulesErrorMsg,

      referralCode,
      referralCodeError,
      referralCodeErrorMsg,

      haveReferralCode,
      referralUser,
    } = this.state;

    const { signUpInProcess, referralInfo: { isActive: referralIsActive } = {} } = this.props;

    return (
      <AuthFormLayout title="Sign Up" className={styles.formAuthSingUp} formContentClassName={styles.formAuthSingUp__formContent}>
        <>
          <div className={authFormStyles.authForm__inputs}>
            <PersonalInformationFields
              onChange={this.changeInputHandler}
              validateField={this.validateField}
              request={this.onSignUpRequest}
              fields={[
                {
                  type: FormFieldsPersonalInformationConstants.name,
                  id: FormFieldsPersonalInformationConstants.username,
                  value: username,
                  invalid: usernameError,
                  invalidMessage: usernameErrorMsg,
                },
                {
                  type: FormFieldsPersonalInformationConstants.email,
                  id: FormFieldsPersonalInformationConstants.email,
                  value: email,
                  invalid: emailError,
                  invalidMessage: emailErrorMsg,
                },
                {
                  type: FormFieldsPersonalInformationConstants.newPassword,
                  id: FormFieldsPersonalInformationConstants.password,
                  value: password,
                  invalid: passwordError,
                  invalidMessage: passwordErrorMsg,
                },
                {
                  type: FormFieldsPersonalInformationConstants.newPasswordRepeat,
                  id: FormFieldsPersonalInformationConstants.passwordConfirm,
                  value: passwordConfirm,
                  invalid: passwordConfirmError,
                  invalidMessage: passwordConfirmErrorMsg,
                  comparisonValue: password,
                },
                {
                  type: FormFieldsPersonalInformationConstants.countryId,
                  id: FormFieldsPersonalInformationConstants.countryId,
                  value: countryId,
                  onChange: this.changeCountry,
                },
              ]}
            />
            {referralIsActive && (
              <>
                <Button
                  type="button_string"
                  text="Have an invitation code?"
                  className={classNames(['c-gray-2 button-referral-code', haveReferralCode && 'button-referral-code_shown'])}
                  onClick={() => {
                    this.setState({
                      haveReferralCode: !haveReferralCode,
                    });
                  }}
                />
                <ReferralProgram
                  haveReferralCode={haveReferralCode}
                  referralCode={referralCode}
                  referralCodeError={referralCodeError}
                  referralCodeErrorMsg={referralCodeErrorMsg}
                  referralUser={referralUser}
                  changeReferralUser={this.changeReferralUser}
                  handlers={{
                    badRequest: this.badRequest,
                    changeInputHandler: this.changeInputHandler,
                    setInputError: this.setInputError,
                    validateField: this.validateField,
                    onKeyDown: (e) => pressEnterKeyInputHandler(e, this.onSignUpRequest),
                  }}
                />
              </>
            )}
          </div>
          <CheckBox
            id="acceptRules"
            checked={acceptRules}
            invalid={acceptRulesError}
            invalidMsg={acceptRulesErrorMsg}
            onChange={this.changeCheckBoxHandler}
          >
            I have read and agree to the <TermsLink /> and <PrivacyPolicyLink />
          </CheckBox>
          <div className={classNames([authFormStyles.authForm__buttonBlock, 'm-top-5'])}>
            <Button
              text="Sign Up"
              isInProcess={signUpInProcess}
              onClick={this.onSignUpRequest}
              disabled={this.disabledSignUpRequest()}
            />
          </div>
          <AuthFooter
            message={{
              messageClass: 'c-black',
              messageText: 'Already a member?',
            }}
            button={{
              buttonClass: 'c-blue t-bold',
              buttonText: 'Log In',
              buttonHref: RoutePathsConstants.SIGN_IN,
              buttonHrefParams: email && !emailError ? { email } : {},
            }}
          />
        </>
      </AuthFormLayout>
    );
  }
}

export default connect(
  (state) => ({
    signUpInProcess: state.AuthReducer.signUpInProcess,
    variables: state.VariablesReducer.variables,

    languageSelected: state.GlobalReducer.languageSelected,

    referralInfo: state.PromoReducer.promoActions.REFERRAL_PROGRAM,
  }),
  (dispatch) => ({
    signUpRequest: (data) => signUpRequestAction(data)(dispatch),
    showPopup: (popupId, popupData = {}, closeOtherPopups = true) => {
      dispatch(showPopupAction(popupId, popupData, closeOtherPopups));
    },
  })
)(SignUpForm);
