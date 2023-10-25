import { Component } from 'react';

import { connect } from 'react-redux';

import PersonalInformationFields from '@/components/forms/personal/profile/PersonalInformationFields';
import ProfileFormLayout from '@/components/layouts/ProfileFormLayout';
import Button from '@/components/ui/buttons/Button';
import UserChangeAvatar from '@/components/user/UserChangeAvatar';
import { CommonErrorMessages } from '@/constants/common/errorsMessage';
import { CommonMessagesConstants } from '@/constants/common/message';
import { CommonRegExpConstants } from '@/constants/common/regExp';
import { FormFieldsPersonalInformationConstants } from '@/constants/form/fields';
import { PopupPersonalIdsConstants } from '@/constants/popups/id';
import { showPopupAction } from '@/redux-actions/components/popupActions';
import { changePersonalInformationRequestAction } from '@/redux-actions/personal/personalActions';
import { handleErrorUtil } from '@/utils/apiUtils';
import { appendFormUtil } from '@/utils/form/formUtils';
import { changeInputHandler, setInputError, validateField } from '@/utils/inputHandlersUtil';
import { isTextChangedUtil } from '@/utils/textUtils';
import { ValidateBadRequestUtil, ValidateMaxLengthUtil, ValidateRegularTestUtil } from '@/utils/validate/inputCheckValidate';

import styles from './styles.module.scss';

const isChangedInput = (inputState, inputProps) => isTextChangedUtil(inputProps, inputState);

class PersonalInformationChangeForm extends Component {
  constructor(props) {
    super(props);

    this.changeInputHandler = changeInputHandler.bind(this);
    this.validateField = validateField.bind(this);
    this.setInputError = setInputError.bind(this);
    this.badRequest = ValidateBadRequestUtil.bind(this);

    const { userInfo: { name, about, email, country = {} } = {} } = props;

    this.state = {
      name: name || '',
      nameError: false,
      nameErrorMsg: '',

      about: about || '',
      aboutError: false,
      aboutErrorMsg: '',

      email: email || '',
      emailError: false,
      emailErrorMsg: '',

      countryId: country.id || undefined,
      countryIdError: false,
    };
  }

  isChangedInputUserName = () => {
    const { name: nameState } = this.state;
    const { userInfo: { name = '' } = {} } = this.props;

    return isChangedInput(nameState, name);
  };

  isChangedInputAbout = () => {
    const { about: aboutState } = this.state;
    const { userInfo: { about = '' } = {} } = this.props;

    return isChangedInput(aboutState, about);
  };

  isChangedInputEmail = () => {
    const { email: emailState } = this.state;
    const { userInfo: { email = '' } = {} } = this.props;

    return isChangedInput(emailState, email);
  };

  isChangedInputCountry = () => {
    const { countryId: countryIdState } = this.state;
    const { userInfo: { country: { id } = '' } = {} } = this.props;

    return isChangedInput(countryIdState, id);
  };

  isChangedInputs = () =>
    this.isChangedInputAbout() || this.isChangedInputUserName() || this.isChangedInputEmail() || this.isChangedInputCountry();

  changeCountry = (country) => {
    const { id } = country;

    this.setState({
      countryId: id,
      countryIdError: false,
    });
  };

  disabledSavePersonalInformation = () => {
    const {
      name,
      nameError,

      about,
      aboutError,

      email,
      emailError,

      countryId,
      countryIdError,
    } = this.state;

    const { changePersonalInformationInProcess } = this.props;

    return (
      changePersonalInformationInProcess ||
      (this.isChangedInputAbout() && (!ValidateMaxLengthUtil(about, CommonErrorMessages.COMMENT_MAX_LENGTH) || aboutError)) ||
      (this.isChangedInputUserName() &&
        (!name ||
          nameError ||
          !ValidateRegularTestUtil(name, CommonRegExpConstants.NAME_VALIDATE) ||
          !ValidateMaxLengthUtil(name, CommonErrorMessages.USER_NAME_MAX_LENGTH))) ||
      (this.isChangedInputEmail() &&
        (!email ||
          emailError ||
          !ValidateRegularTestUtil(email, CommonRegExpConstants.EMAIL_VALIDATE) ||
          !ValidateMaxLengthUtil(email, CommonErrorMessages.EMAIL_MAX_LENGTH))) ||
      (this.isChangedInputCountry() && (!countryId || countryIdError))
    );
  };

  buildFormFields = () => {
    const { name, about, email, countryId } = this.state;

    return [
      {
        name: FormFieldsPersonalInformationConstants.name,
        value: name,
      },
      {
        name: FormFieldsPersonalInformationConstants.about,
        value: about,
      },
      {
        name: FormFieldsPersonalInformationConstants.email,
        value: email,
      },
      {
        name: FormFieldsPersonalInformationConstants.countryId,
        value: countryId,
      },
    ];
  };

  onSavePersonalInformation = ({ withValidate = true, fieldsForm = this.buildFormFields() } = {}) => {
    const { changePersonalInformationRequest, showPopup } = this.props;

    if (this.disabledSavePersonalInformation() && withValidate) {
      return;
    }

    const formData = appendFormUtil({ fieldsForm });

    changePersonalInformationRequest(formData)
      .then(() => {
        showPopup(PopupPersonalIdsConstants.ChangePersonalInformationSuccessPopup);
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
            USERNAME_ALREADY_EXISTS: () => {
              this.setInputError('name', CommonErrorMessages.USERNAME_ALREADY_EXISTS);
            },
          });
        }
      });
  };

  render() {
    const {
      name,
      nameError,
      nameErrorMsg,

      about,
      aboutError,
      aboutErrorMsg,

      email,
      emailError,
      emailErrorMsg,

      countryId,
    } = this.state;

    const { userInfo: { emailConfirmed, avatar } = {}, changePersonalInformationInProcess } = this.props;

    return (
      <ProfileFormLayout name={styles.baseInformation} id="base-information">
        <div className="inputs">
          <div className="m-bottom-15">
            <UserChangeAvatar image={avatar} />
          </div>
          <PersonalInformationFields
            onChange={this.changeInputHandler}
            validateField={this.validateField}
            request={this.onSavePersonalInformation}
            fields={[
              {
                type: FormFieldsPersonalInformationConstants.name,
                id: FormFieldsPersonalInformationConstants.name,
                value: name,
                invalid: nameError,
                invalidMessage: nameErrorMsg,
              },
              {
                type: FormFieldsPersonalInformationConstants.email,
                id: FormFieldsPersonalInformationConstants.email,
                value: email,
                invalid: emailError,
                invalidMessage: emailErrorMsg,
                disabledValue: emailConfirmed,
              },
              {
                type: FormFieldsPersonalInformationConstants.countryId,
                id: FormFieldsPersonalInformationConstants.countryId,
                value: countryId,
                onChange: this.changeCountry,
              },
              {
                type: FormFieldsPersonalInformationConstants.about,
                id: FormFieldsPersonalInformationConstants.about,
                value: about,
                invalid: aboutError,
                invalidMessage: aboutErrorMsg,
              },
            ]}
          />
        </div>
        <Button
          text={CommonMessagesConstants.SAVE}
          className="m-top-10 w-100pct"
          isInProcess={changePersonalInformationInProcess}
          disabled={!this.isChangedInputs() || this.disabledSavePersonalInformation()}
          onClick={this.onSavePersonalInformation}
        />
      </ProfileFormLayout>
    );
  }
}

export default connect(
  (state) => ({
    userInfo: state.AuthReducer.userInfo,
    changePersonalInformationInProcess: state.PersonalReducer.changePersonalInformationInProcess,
  }),
  (dispatch) => ({
    changePersonalInformationRequest: (formData) => changePersonalInformationRequestAction(formData)(dispatch),
    showPopup: (popupId, popupData = {}, closeOtherPopups = true) => {
      dispatch(showPopupAction(popupId, popupData, closeOtherPopups));
    },
  })
)(PersonalInformationChangeForm);
