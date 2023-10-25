import { Component } from 'react';

import { connect } from 'react-redux';

import PersonalInformationFields from '@/components/forms/personal/profile/PersonalInformationFields';
import ProfileFormLayout from '@/components/layouts/ProfileFormLayout';
import Button from '@/components/ui/buttons/Button';
import CheckBox from '@/components/ui/inputs/CheckBox';
import { CommonErrorMessages } from '@/constants/common/errorsMessage';
import { CommonMessagesConstants } from '@/constants/common/message';
import { CommonRegExpConstants } from '@/constants/common/regExp';
import { FormFieldsPersonalInformationConstants } from '@/constants/form/fields';
import { PopupPasswordIdsConstants } from '@/constants/popups/id';
import { showPopupAction } from '@/redux-actions/components/popupActions';
import { changePasswordRequestAction } from '@/redux-actions/personal/personalActions';
import { handleErrorUtil } from '@/utils/apiUtils';
import { changeCheckBoxHandler, changeInputHandler, setInputError, validateField } from '@/utils/inputHandlersUtil';
import { ValidateBadRequestUtil, ValidateMinLengthUtil, ValidateRegularTestUtil } from '@/utils/validate/inputCheckValidate';

class PasswordChangeForm extends Component {
  constructor(props) {
    super(props);

    this.changeInputHandler = changeInputHandler.bind(this);
    this.changeCheckBoxHandler = changeCheckBoxHandler.bind(this);
    this.validateField = validateField.bind(this);
    this.setInputError = setInputError.bind(this);
    this.badRequest = ValidateBadRequestUtil.bind(this);

    this.state = {
      currentPassword: '',
      currentPasswordError: false,
      currentPasswordErrorMsg: '',

      newPassword: '',
      newPasswordError: false,
      newPasswordErrorMsg: '',

      newPasswordRepeat: '',
      newPasswordRepeatError: false,
      newPasswordRepeatErrorMsg: '',

      logoutFromAllSessions: false,
      logoutFromAllSessionsError: false,
      logoutFromAllSessionsErrorMsg: '',
    };
  }

  disabledSavePassword = () => {
    const {
      currentPassword,
      currentPasswordError,

      newPassword,
      newPasswordError,

      newPasswordRepeat,
      newPasswordRepeatError,
    } = this.state;

    const { changePasswordInProcess } = this.props;

    return (
      changePasswordInProcess ||
      !currentPassword ||
      !newPassword ||
      !newPasswordRepeat ||
      currentPasswordError ||
      newPasswordError ||
      newPasswordRepeatError ||
      newPassword !== newPasswordRepeat ||
      !ValidateRegularTestUtil(newPassword, CommonRegExpConstants.PASSWORD_VALIDATE) ||
      !ValidateMinLengthUtil(newPassword, CommonErrorMessages.PASSWORD_MIN_LENGTH) ||
      !ValidateMinLengthUtil(newPasswordRepeat, CommonErrorMessages.PASSWORD_MIN_LENGTH)
    );
  };

  onChangePassword = () => {
    const { currentPassword, newPassword, newPasswordRepeat, logoutFromAllSessions } = this.state;

    const { changePasswordRequest, showPopup } = this.props;

    if (this.disabledSavePassword()) {
      return;
    }

    changePasswordRequest({
      currentPassword,
      newPassword,
      newPasswordRepeat,
      logoutFromAllSessions,
    })
      .then(() => {
        showPopup(PopupPasswordIdsConstants.ChangePasswordSuccessPopup);
        this.resetChangePasswordInputs();
      })
      .catch(({ error, payload: { errorField } = {} }) => {
        if (error) {
          handleErrorUtil(error, {
            BAD_REQUEST: () => {
              this.badRequest(errorField);
            },
            REPEAT_PASSWORD_DOES_NOT_MATCH: () => {
              this.setInputError('newPasswordRepeat', CommonErrorMessages.REPEAT_PASSWORD_ERROR);
            },
            CURRENT_PASSWORD_DOES_NOT_MATCH: () => {
              this.setInputError('currentPassword', CommonErrorMessages.INVALID_PASSWORD);
            },
          });
        }
      });
  };

  resetChangePasswordInputs = () => {
    this.setState({
      currentPassword: '',
      newPassword: '',
      newPasswordRepeat: '',
      logoutFromAllSessions: false,
    });
  };

  render() {
    const { changePasswordInProcess } = this.props;

    const {
      currentPassword,
      currentPasswordError,
      currentPasswordErrorMsg,

      newPassword,
      newPasswordError,
      newPasswordErrorMsg,

      newPasswordRepeat,
      newPasswordRepeatError,
      newPasswordRepeatErrorMsg,

      logoutFromAllSessions,
      logoutFromAllSessionsError,
      logoutFromAllSessionsErrorMsg,
    } = this.state;

    return (
      <ProfileFormLayout title="Password change" id="password-change">
        <div className="inputs">
          <PersonalInformationFields
            onChange={this.changeInputHandler}
            validateField={this.validateField}
            request={this.onChangePassword}
            fields={[
              {
                type: FormFieldsPersonalInformationConstants.currentPassword,
                id: FormFieldsPersonalInformationConstants.currentPassword,
                value: currentPassword,
                invalid: currentPasswordError,
                invalidMessage: currentPasswordErrorMsg,
              },
              {
                type: FormFieldsPersonalInformationConstants.newPassword,
                id: FormFieldsPersonalInformationConstants.newPassword,
                value: newPassword,
                invalid: newPasswordError,
                invalidMessage: newPasswordErrorMsg,
              },
              {
                type: FormFieldsPersonalInformationConstants.newPasswordRepeat,
                id: FormFieldsPersonalInformationConstants.newPasswordRepeat,
                value: newPasswordRepeat,
                invalid: newPasswordRepeatError,
                invalidMessage: newPasswordRepeatErrorMsg,
                comparisonValue: newPassword,
              },
            ]}
          />
        </div>
        <CheckBox
          id="logoutFromAllSessions"
          label="Logout from all sessions"
          checked={logoutFromAllSessions}
          invalid={logoutFromAllSessionsError}
          invalidMsg={logoutFromAllSessionsErrorMsg}
          onChange={this.changeCheckBoxHandler}
        />
        <Button
          text={CommonMessagesConstants.SAVE}
          className="m-top-10 w-100pct"
          isInProcess={changePasswordInProcess}
          disabled={this.disabledSavePassword()}
          onClick={this.onChangePassword}
        />
      </ProfileFormLayout>
    );
  }
}

export default connect(
  (state) => ({
    changePasswordInProcess: state.PersonalReducer.changePasswordInProcess,
  }),
  (dispatch) => ({
    showPopup: (popupId, popupData = {}, closeOtherPopups = true) => {
      dispatch(showPopupAction(popupId, popupData, closeOtherPopups));
    },
    changePasswordRequest: (params) => changePasswordRequestAction(params)(dispatch),
  })
)(PasswordChangeForm);
