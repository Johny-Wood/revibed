import { Component } from 'react';

import { connect } from 'react-redux';

import PersonalInformationFields from '@/components/forms/personal/profile/PersonalInformationFields';
import Popup from '@/components/primary/Popup';
import PopupDoubleButtons from '@/components/primary/Popup/_components/PopupDoubleButtons';
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
import { ValidateMaxLengthUtil, ValidateRegularTestUtil } from '@/utils/validate/inputCheckValidate';

const isChangedInput = (inputState, inputProps) => isTextChangedUtil(inputProps, inputState);

class EditProfileFieldsPopup extends Component {
  constructor(props) {
    super(props);

    this.changeInputHandler = changeInputHandler.bind(this);
    this.validateField = validateField.bind(this);
    this.setInputError = setInputError.bind(this);

    const { userInfo: { name, about, country = {} } = {} } = props;

    this.state = {
      name: name || '',
      nameError: false,
      nameErrorMsg: '',

      about: about || '',
      aboutError: false,
      aboutErrorMsg: '',

      countryId: country.id || undefined,
      countryIdError: false,
    };
  }

  isChangedInputUserName = () => {
    const { name: nameState } = this.state;
    const { userInfo: { name = '' } = {} } = this.props;

    return isChangedInput(nameState, name);
  };

  isChangedInputCountry = () => {
    const { countryId: countryIdState } = this.state;
    const { userInfo: { country: { id } = '' } = {} } = this.props;

    return isChangedInput(countryIdState, id);
  };

  isChangedInputAbout = () => {
    const { about: aboutState } = this.state;
    const { userInfo: { about = '' } = {} } = this.props;

    return isChangedInput(aboutState, about);
  };

  isChangedInputs = () => this.isChangedInputUserName() || this.isChangedInputAbout() || this.isChangedInputCountry();

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

      countryId,
      countryIdError,
    } = this.state;

    const { changePersonalInformationInProcess } = this.props;

    return (
      changePersonalInformationInProcess ||
      (this.isChangedInputUserName() &&
        (!name ||
          nameError ||
          !ValidateRegularTestUtil(name, CommonRegExpConstants.NAME_VALIDATE) ||
          !ValidateMaxLengthUtil(name, CommonErrorMessages.USER_NAME_MAX_LENGTH))) ||
      (this.isChangedInputAbout() && (!ValidateMaxLengthUtil(about, CommonErrorMessages.COMMENT_MAX_LENGTH) || aboutError)) ||
      (this.isChangedInputCountry() && (!countryId || countryIdError))
    );
  };

  onSavePersonalInformation = () =>
    new Promise((resolve, reject) => {
      const { name, countryId, about } = this.state;

      const { popupData: { fields = [] } = {}, changePersonalInformationRequest, showPopup } = this.props;

      if (!this.isChangedInputs() || this.disabledSavePersonalInformation()) {
        reject();
        return;
      }

      const formData = appendFormUtil({
        fieldsForm: [
          {
            name: FormFieldsPersonalInformationConstants.about,
            value: about,
          },
          {
            name: FormFieldsPersonalInformationConstants.name,
            value: name,
          },
          {
            name: FormFieldsPersonalInformationConstants.countryId,
            value: countryId,
          },
        ].filter(({ name: fieldName }) => fields.includes(fieldName)),
      });

      changePersonalInformationRequest(formData)
        .then(() => {
          resolve();

          showPopup(PopupPersonalIdsConstants.ChangePersonalInformationSuccessPopup);
        })
        .catch(({ error, payload: { errorField } = {} }) => {
          if (error) {
            handleErrorUtil(error, {
              BAD_REQUEST: () => {
                this.badRequest(errorField);
              },
              USERNAME_ALREADY_EXISTS: () => {
                this.setInputError('name', CommonErrorMessages.USERNAME_ALREADY_EXISTS);
              },
            });
          }

          reject();
        });
    });

  getFields = () => {
    const {
      name,
      nameError,
      nameErrorMsg,

      about,
      aboutError,
      aboutErrorMsg,

      countryId,
    } = this.state;

    return [
      {
        type: FormFieldsPersonalInformationConstants.about,
        id: FormFieldsPersonalInformationConstants.about,
        value: about,
        invalid: aboutError,
        invalidMessage: aboutErrorMsg,
      },
      {
        type: FormFieldsPersonalInformationConstants.name,
        id: FormFieldsPersonalInformationConstants.name,
        value: name,
        invalid: nameError,
        invalidMessage: nameErrorMsg,
      },
      {
        type: FormFieldsPersonalInformationConstants.countryId,
        id: FormFieldsPersonalInformationConstants.countryId,
        value: countryId,
        onChange: this.changeCountry,
      },
    ];
  };

  getActiveFields = () => {
    const { popupData: { fields = [] } = {} } = this.props;

    return this.getFields().filter(({ type }) => fields.includes(type));
  };

  render() {
    const {
      popupId = PopupPersonalIdsConstants.EditProfileFieldsPopup,
      popupData: { title } = {},

      changePersonalInformationInProcess,
      closePopup,
    } = this.props;

    return (
      <Popup popupId={popupId} headerText={title} maxWidth={490} overflowVisible>
        <div className="inputs">
          <PersonalInformationFields
            onChange={this.changeInputHandler}
            validateField={this.validateField}
            request={this.onSavePersonalInformation}
            fields={this.getActiveFields()}
          />
        </div>
        <PopupDoubleButtons
          popupId={popupId}
          closePopup={closePopup}
          okButtonText={CommonMessagesConstants.CHANGE}
          okButtonOnClick={this.onSavePersonalInformation}
          okButtonInProcess={changePersonalInformationInProcess}
          okButtonDisables={!this.isChangedInputs() || this.disabledSavePersonalInformation()}
        />
      </Popup>
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
)(EditProfileFieldsPopup);
