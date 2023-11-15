import { Component, createRef } from 'react';

import classNames from 'classnames';
import cloneDeep from 'lodash/cloneDeep';
import { connect } from 'react-redux';

import PhoneNumberInput from '@/components/common-ui/inputs/PhoneNumberInput';
import FileUploader from '@/components/common/FileUploader';
import FileUploaderListNames from '@/components/common/FileUploader/_components/FileUploaderListNames';
import PersonalInformationFields from '@/components/forms/personal/profile/PersonalInformationFields';
import RightsholdersFormGroup from '@/components/forms/RightsholdersForm/_components/RightsholdersFormGroup';
import Button from '@/components/ui/buttons/Button';
import CheckBox from '@/components/ui/inputs/CheckBox';
import Input from '@/components/ui/inputs/Input';
import { CommonErrorMessages } from '@/constants/common/errorsMessage';
import { CommonRegExpConstants } from '@/constants/common/regExp';
import { CommonScrollbarLocationsConstants } from '@/constants/common/scrollBar';
import FilesTypesConstants from '@/constants/files/types';
import { FormFieldsPersonalInformationConstants } from '@/constants/form/fields';
import { PopupCommonIdsConstants } from '@/constants/popups/id';
import { RoutePathsConstants } from '@/constants/routes/routes';
import ScrollBlockIdConstants from '@/constants/scroll/scrollBlockId';
import { showPopupAction } from '@/redux-actions/components/popupActions';
import { sendFeedbackOwnerShipTicketRequestAction } from '@/redux-actions/feedback/feedbackActions';
import ScrollService from '@/services/scroll/ScrollService';
import { handleErrorUtil } from '@/utils/apiUtils';
import { changeCheckBoxHandler, changeInputHandler, pressEnterKeyInputHandler, validateField } from '@/utils/inputHandlersUtil';
import {
  ValidateBadRequestUtil,
  ValidateMaxLengthUtil,
  ValidateMinLengthUtil,
  ValidateRegularTestUtil,
} from '@/utils/validate/inputCheckValidate';

import styles from './styles.module.scss';

const initialState = {
  companyName: '',
  companyNameError: false,
  companyNameErrorMsg: '',

  contactEmail: '',
  contactEmailError: false,
  contactEmailErrorMsg: '',

  address: '',
  addressError: false,
  addressErrorMsg: '',

  phone: '',
  phoneError: false,
  phoneErrorMsg: '',

  titleOfRecord: '',
  titleOfRecordError: false,
  titleOfRecordErrorMsg: '',

  nameOfArtist: '',
  nameOfArtistError: false,
  nameOfArtistErrorMsg: '',

  nameOfCompress: '',
  nameOfCompressError: false,
  nameOfCompressErrorMsg: '',

  label: '',
  labelError: false,
  labelErrorMsg: '',

  dateOfRelease: '',
  dateOfReleaseError: false,
  dateOfReleaseErrorMsg: '',

  isrc: '',
  isrcError: false,
  isrcErrorMsg: '',

  knowledgeAgree: false,
  knowledgeAgreeError: false,
  knowledgeAgreeErrorMsg: '',

  licenseAgree: false,
  licenseAgreeError: false,
  licenseAgreeErrorMsg: '',

  attachments: [],
  attachmentsError: false,
  attachmentsErrorMsg: '',

  attachmentsBlob: [],
  attachmentsBlobError: false,
  attachmentsBlobErrorMsg: '',
};

function padDate(num) {
  return num < 10 ? `0${num}` : num;
}

class RightsholdersForm extends Component {
  constructor(props) {
    super(props);

    this.sectionRef = createRef();

    this.changeInputHandler = changeInputHandler.bind(this);
    this.validateField = validateField.bind(this);
    this.changeCheckBoxHandler = changeCheckBoxHandler.bind(this);
    this.badRequest = ValidateBadRequestUtil.bind(this);

    this.isValidPhone = true;
    this.format = '';

    this.state = {
      ...initialState,
    };
  }

  componentDidMount() {
    ScrollService.getInstance(CommonScrollbarLocationsConstants.MAIN_SCROLL).addSection(
      ScrollBlockIdConstants.RIGHTSHOLDERS_PROJECT,
      RoutePathsConstants.RIGHTSHOLDERS_FORM,
      this.sectionRef
    );
  }

  onChangePhone = (e) => {
    this.setState({
      phone: e?.target?.value || '',
      phoneError: false,
      phoneErrorMsg: '',
    });
  };

  phoneIsValid = (isValid, format) => {
    this.isValidPhone = isValid;
    this.format = format;
  };

  onBlurPhone = (e) => {
    this.validateField(e, {
      validateEmptyField: true,
    });

    if (!this.isValidPhone) {
      this.setState({
        phoneError: true,
        phoneErrorMsg: `${CommonErrorMessages.PHONE_WRONG}${this.format ? `. Valid format ${this.format}` : ''}`,
      });
    }
  };

  disabledRequest = () => {
    const { sendFeedbackOwnerShipTicketInProcess } = this.props;

    const {
      contactEmail,
      contactEmailError,

      companyName,
      companyNameError,

      address,
      addressError,

      phone,
      phoneError,

      titleOfRecord,
      titleOfRecordError,

      nameOfArtist,
      nameOfArtistError,

      nameOfCompress,
      nameOfCompressError,

      label,
      labelError,

      dateOfRelease,
      dateOfReleaseError,

      isrc,
      isrcError,

      knowledgeAgree,
      knowledgeAgreeError,

      licenseAgree,
      licenseAgreeError,

      attachments,
      attachmentsError,

      attachmentsBlob,
      attachmentsBlobError,
    } = this.state;

    return (
      sendFeedbackOwnerShipTicketInProcess ||
      !contactEmail ||
      contactEmailError ||
      !companyName ||
      companyNameError ||
      !address ||
      addressError ||
      !phone ||
      phoneError ||
      !titleOfRecord ||
      titleOfRecordError ||
      !nameOfArtist ||
      nameOfArtistError ||
      !nameOfCompress ||
      nameOfCompressError ||
      !label ||
      labelError ||
      !dateOfRelease ||
      dateOfReleaseError ||
      !isrc ||
      isrcError ||
      !knowledgeAgree ||
      knowledgeAgreeError ||
      !licenseAgree ||
      licenseAgreeError ||
      attachments.length === 0 ||
      attachmentsError ||
      attachmentsBlob.length === 0 ||
      attachmentsBlobError
    );
  };

  sendRequest = () => {
    if (this.disabledRequest()) {
      return;
    }

    const { sendFeedbackOwnerShipTicketRequest, showPopup } = this.props;

    const {
      contactEmail,
      companyName,
      address,
      phone,
      titleOfRecord,
      nameOfArtist,
      nameOfCompress,
      label,
      dateOfRelease,
      isrc,
      knowledgeAgree,
      licenseAgree,
      attachmentsBlob,
    } = this.state;

    const date = new Date(dateOfRelease);
    const transformedDateFormat = `${padDate(date.getMonth() + 1)}/${padDate(date.getDate())}/${date.getFullYear() % 100}`;

    const formData = new FormData();

    formData.append('contactEmail', contactEmail || '');
    formData.append('companyName', companyName || '');
    formData.append('address', address || '');
    formData.append('phone', phone ? phone.replace('+', '') : '');
    formData.append('titleOfRecord', titleOfRecord || '');
    formData.append('nameOfArtist', nameOfArtist || '');
    formData.append('nameOfCompress', nameOfCompress || '');
    formData.append('label', label || '');
    formData.append('dateOfRelease', transformedDateFormat || '');
    formData.append('isrc', isrc || '');
    formData.append('knowledgeAgree', knowledgeAgree || '');
    formData.append('licenseAgree', licenseAgree || '');

    for (let i = 0; i < attachmentsBlob.length; i++) {
      const { file } = attachmentsBlob[i];

      formData.append('attachments', file || '');
    }

    sendFeedbackOwnerShipTicketRequest(formData)
      .then(() => {
        showPopup(PopupCommonIdsConstants.SuccessPopup, {
          text: 'Thank you for your commitment to&nbsp;the preservation and appreciation of&nbsp;musical heritage.',
        });

        this.clear();
      })
      .catch(({ error, payload: { errorField } = {} }) => {
        if (error) {
          handleErrorUtil(error, {
            BAD_REQUEST: () => {
              this.badRequest(errorField);
            },
            NEED_AGREEMENT: () => {
              this.setInputError('knowledgeAgree', CommonErrorMessages.AGREE);
              this.setInputError('licenseAgree', CommonErrorMessages.AGREE);
            },
          });
        }
      });
  };

  clear = () => {
    this.setState({ ...initialState });
    this.isValidPhone = true;
    this.format = '';

    ScrollService.getInstance(CommonScrollbarLocationsConstants.MAIN_SCROLL)
      .scrollToElement({
        sectionId: ScrollBlockIdConstants.RIGHTSHOLDERS_PROJECT,
        secondOffset: 300,
        inRoute: true,
      })
      .then();
  };

  onRemoveFiles = (id) => {
    const { attachments, attachmentsBlob } = this.state;

    const tmpFiles = cloneDeep(attachments);
    const tmpFilesBlob = cloneDeep(attachmentsBlob);

    const findFilesIdx = tmpFiles.findIndex((f) => f.id === id);
    const findFilesBlobIdx = tmpFilesBlob.findIndex((f) => f.id === id);

    tmpFiles.splice(findFilesIdx, 1);
    tmpFilesBlob.splice(findFilesBlobIdx, 1);

    this.setState({
      attachments: tmpFiles,
      attachmentsBlob: tmpFilesBlob,
    });
  };

  render() {
    const { sendFeedbackOwnerShipTicketInProcess } = this.props;

    const {
      contactEmail,
      contactEmailError,
      contactEmailErrorMsg,

      companyName,
      companyNameError,
      companyNameErrorMsg,

      address,
      addressError,
      addressErrorMsg,

      phone,
      phoneError,
      phoneErrorMsg,

      titleOfRecord,
      titleOfRecordError,
      titleOfRecordErrorMsg,

      nameOfArtist,
      nameOfArtistError,
      nameOfArtistErrorMsg,

      nameOfCompress,
      nameOfCompressError,
      nameOfCompressErrorMsg,

      label,
      labelError,
      labelErrorMsg,

      dateOfRelease,
      dateOfReleaseError,
      dateOfReleaseErrorMsg,

      isrc,
      isrcError,
      isrcErrorMsg,

      knowledgeAgree,
      knowledgeAgreeError,
      knowledgeAgreeErrorMsg,

      licenseAgree,
      licenseAgreeError,
      licenseAgreeErrorMsg,

      attachments,
      attachmentsError,
      attachmentsErrorMsg,
    } = this.state;

    return (
      <div className={classNames(styles.RightsholdersForm)} ref={this.sectionRef}>
        <RightsholdersFormGroup description="Company Information:">
          <Input
            id="companyName"
            label="Company Name"
            value={companyName}
            invalid={companyNameError}
            invalidMessage={companyNameErrorMsg}
            onChange={this.changeInputHandler}
            onBlur={(e) => {
              this.validateField(e, {
                fieldIsValid: (fieldValue) => ValidateRegularTestUtil(fieldValue, CommonRegExpConstants.FIELD_VALIDATE),
                invalidMessage: CommonErrorMessages.USER_NAME_PATTERN,
                validateEmptyField: true,
              });

              this.validateField(e, {
                fieldIsValid: (fieldValue) => ValidateMaxLengthUtil(fieldValue, CommonErrorMessages.USER_NAME_MAX_LENGTH),
                invalidMessage: CommonErrorMessages.USER_NAME_MAX_LENGTH_ERROR,
                validateEmptyField: true,
              });
            }}
            onKeyDown={(e) => {
              pressEnterKeyInputHandler(e, this.sendRequest);
            }}
          />
          <PersonalInformationFields
            onChange={this.changeInputHandler}
            validateField={this.validateField}
            request={this.sendRequest}
            fields={[
              {
                type: FormFieldsPersonalInformationConstants.email,
                id: 'contactEmail',
                label: 'Contact Email',
                value: contactEmail,
                invalid: contactEmailError,
                invalidMessage: contactEmailErrorMsg,
              },
            ]}
          />
          <Input
            id="address"
            label="Address"
            value={address}
            invalid={addressError}
            invalidMessage={addressErrorMsg}
            onChange={this.changeInputHandler}
            onBlur={(e) => {
              this.validateField(e, {
                fieldIsValid: (fieldValue) => ValidateRegularTestUtil(fieldValue, CommonRegExpConstants.FIELD_VALIDATE),
                invalidMessage: CommonErrorMessages.USER_NAME_PATTERN,
                validateEmptyField: true,
              });

              this.validateField(e, {
                fieldIsValid: (fieldValue) => ValidateMaxLengthUtil(fieldValue, CommonErrorMessages.USER_NAME_MAX_LENGTH),
                invalidMessage: CommonErrorMessages.USER_NAME_MAX_LENGTH_ERROR,
                validateEmptyField: true,
              });
            }}
            onKeyDown={(e) => {
              pressEnterKeyInputHandler(e, this.sendRequest);
            }}
          />
          <PhoneNumberInput
            value={phone}
            invalid={phoneError}
            invalidMessage={phoneErrorMsg}
            onChange={this.onChangePhone}
            onBlur={this.onBlurPhone}
            isValidCallback={this.phoneIsValid}
            callback={this.sendRequest}
          />
        </RightsholdersFormGroup>
        <RightsholdersFormGroup description="Recording Information:">
          <Input
            id="titleOfRecord"
            label="Title of the Recording(s)"
            value={titleOfRecord}
            invalid={titleOfRecordError}
            invalidMessage={titleOfRecordErrorMsg}
            onChange={this.changeInputHandler}
            onBlur={(e) => {
              this.validateField(e, {
                fieldIsValid: (fieldValue) => ValidateRegularTestUtil(fieldValue, CommonRegExpConstants.FIELD_VALIDATE),
                invalidMessage: CommonErrorMessages.USER_NAME_PATTERN,
                validateEmptyField: true,
              });

              this.validateField(e, {
                fieldIsValid: (fieldValue) => ValidateMaxLengthUtil(fieldValue, CommonErrorMessages.USER_NAME_MAX_LENGTH),
                invalidMessage: CommonErrorMessages.USER_NAME_MAX_LENGTH_ERROR,
                validateEmptyField: true,
              });
            }}
            onKeyDown={(e) => {
              pressEnterKeyInputHandler(e, this.sendRequest);
            }}
          />
          <Input
            id="nameOfArtist"
            label="Name of the Artist(s)"
            value={nameOfArtist}
            invalid={nameOfArtistError}
            invalidMessage={nameOfArtistErrorMsg}
            onChange={this.changeInputHandler}
            onBlur={(e) => {
              this.validateField(e, {
                fieldIsValid: (fieldValue) => ValidateRegularTestUtil(fieldValue, CommonRegExpConstants.FIELD_VALIDATE),
                invalidMessage: CommonErrorMessages.USER_NAME_PATTERN,
                validateEmptyField: true,
              });

              this.validateField(e, {
                fieldIsValid: (fieldValue) => ValidateMaxLengthUtil(fieldValue, CommonErrorMessages.USER_NAME_MAX_LENGTH),
                invalidMessage: CommonErrorMessages.USER_NAME_MAX_LENGTH_ERROR,
                validateEmptyField: true,
              });
            }}
            onKeyDown={(e) => {
              pressEnterKeyInputHandler(e, this.sendRequest);
            }}
          />
          <Input
            id="nameOfCompress"
            label="Name of the Composer(s)"
            value={nameOfCompress}
            invalid={nameOfCompressError}
            invalidMessage={nameOfCompressErrorMsg}
            onChange={this.changeInputHandler}
            onBlur={(e) => {
              this.validateField(e, {
                fieldIsValid: (fieldValue) => ValidateRegularTestUtil(fieldValue, CommonRegExpConstants.FIELD_VALIDATE),
                invalidMessage: CommonErrorMessages.USER_NAME_PATTERN,
                validateEmptyField: true,
              });

              this.validateField(e, {
                fieldIsValid: (fieldValue) => ValidateMaxLengthUtil(fieldValue, CommonErrorMessages.USER_NAME_MAX_LENGTH),
                invalidMessage: CommonErrorMessages.USER_NAME_MAX_LENGTH_ERROR,
                validateEmptyField: true,
              });
            }}
            onKeyDown={(e) => {
              pressEnterKeyInputHandler(e, this.sendRequest);
            }}
          />
          <Input
            id="label"
            label="Label"
            value={label}
            invalid={labelError}
            invalidMessage={labelErrorMsg}
            onChange={this.changeInputHandler}
            onBlur={(e) => {
              this.validateField(e, {
                fieldIsValid: (fieldValue) => ValidateRegularTestUtil(fieldValue, CommonRegExpConstants.FIELD_VALIDATE),
                invalidMessage: CommonErrorMessages.USER_NAME_PATTERN,
                validateEmptyField: true,
              });

              this.validateField(e, {
                fieldIsValid: (fieldValue) => ValidateMaxLengthUtil(fieldValue, CommonErrorMessages.USER_NAME_MAX_LENGTH),
                invalidMessage: CommonErrorMessages.USER_NAME_MAX_LENGTH_ERROR,
                validateEmptyField: true,
              });
            }}
            onKeyDown={(e) => {
              pressEnterKeyInputHandler(e, this.sendRequest);
            }}
          />
          <Input
            id="dateOfRelease"
            label="Date of Release"
            value={dateOfRelease}
            invalid={dateOfReleaseError}
            invalidMessage={dateOfReleaseErrorMsg}
            onChange={this.changeInputHandler}
            type="date"
            onBlur={(e) => {
              this.validateField(e, {
                validateEmptyField: true,
              });
            }}
            onKeyDown={(e) => {
              pressEnterKeyInputHandler(e, this.sendRequest);
            }}
          />
          <Input
            id="isrc"
            label="ISRC"
            value={isrc}
            invalid={isrcError}
            invalidMessage={isrcErrorMsg}
            onChange={this.changeInputHandler}
            maxLength={CommonErrorMessages.ISCR_MAX_LENGTH}
            onBlur={(e) => {
              this.validateField(e, {
                fieldIsValid: (fieldValue) =>
                  ValidateRegularTestUtil(fieldValue, CommonRegExpConstants.LATIN_AND_NUMBERS_VALIDATE),
                invalidMessage: CommonErrorMessages.ISCR_PATTERN,
                validateEmptyField: true,
              });

              this.validateField(e, {
                fieldIsValid: (fieldValue) => ValidateMaxLengthUtil(fieldValue, CommonErrorMessages.ISCR_MAX_LENGTH),
                invalidMessage: CommonErrorMessages.ISCR_MAX_LENGTH_ERROR,
                validateEmptyField: true,
              });

              this.validateField(e, {
                fieldIsValid: (fieldValue) => ValidateMinLengthUtil(fieldValue, CommonErrorMessages.ISCR_MAX_LENGTH),
                invalidMessage: CommonErrorMessages.ISCR_MAX_LENGTH_ERROR,
                validateEmptyField: true,
              });
            }}
            onKeyDown={(e) => {
              pressEnterKeyInputHandler(e, this.sendRequest);
            }}
          />
          <div className={styles.RightsholdersForm__attach}>
            <div className={styles.RightsholdersForm__attachContent}>
              <FileUploader
                multiple
                maxFiles={10}
                maxSize={50}
                minSize={0.004}
                accept=".jpg, .jpeg, .png, .pdf"
                pattern={[
                  FilesTypesConstants.IMAGE.JPG,
                  FilesTypesConstants.IMAGE.JPEG,
                  FilesTypesConstants.IMAGE.PNG,
                  FilesTypesConstants.APPLICATION.PDF,
                ]}
                inputId="attachments"
                files={attachments}
                invalid={attachmentsError}
                invalidMessage={attachmentsErrorMsg}
                callBackUploadFiles={(filesList) => {
                  this.setState({
                    attachments: filesList,
                  });
                }}
                callBackUploadBlobFiles={(filesList) => {
                  this.setState({
                    attachmentsBlob: filesList,
                  });
                }}
              >
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label htmlFor="attachments" className={styles.RightsholdersForm__attachText}>
                  Attach any relevant documents that confirm your master ownership or&nbsp;license, such as&nbsp;contracts,
                  registrations, or&nbsp;other supporting material
                </label>
              </FileUploader>
            </div>
            <FileUploaderListNames
              files={attachments}
              onRemove={this.onRemoveFiles}
              itemClassName={classNames(styles.RightsholdersForm__attachItem)}
            />
          </div>
        </RightsholdersFormGroup>
        <RightsholdersFormGroup>
          <div className={styles.RightsholdersForm__agree}>
            <b>Declaration:</b> By&nbsp;submitting this form, I&nbsp;affirm that:
          </div>
          <CheckBox
            className={classNames(styles.RightsholdersForm__checkbox)}
            id="knowledgeAgree"
            checked={knowledgeAgree}
            invalid={knowledgeAgreeError}
            invalidMsg={knowledgeAgreeErrorMsg}
            onChange={this.changeCheckBoxHandler}
          >
            I&nbsp;am the rightful master owner or&nbsp;licensee of&nbsp;the aforementioned recording(s)
            or&nbsp;am&nbsp;authorized to&nbsp;act on&nbsp;behalf of&nbsp;the master owner or&nbsp;licensee.
          </CheckBox>
          <CheckBox
            className={classNames(styles.RightsholdersForm__checkbox)}
            id="licenseAgree"
            checked={licenseAgree}
            invalid={licenseAgreeError}
            invalidMsg={licenseAgreeErrorMsg}
            onChange={this.changeCheckBoxHandler}
          >
            The information provided in&nbsp;this form is&nbsp;accurate and complete to&nbsp;the best of&nbsp;my&nbsp;knowledge.
          </CheckBox>
        </RightsholdersFormGroup>
        <div className={classNames(styles.RightsholdersForm__description)}>
          By&nbsp;providing the above information, I&nbsp;consent to&nbsp;its use for the purpose of&nbsp;verifying my&nbsp;master
          ownership or&nbsp;license and facilitating communication with me&nbsp;regarding the verification process and the
          establishment of&nbsp;an&nbsp;arrangement.
        </div>
        <div className={classNames(styles.RightsholdersForm__buttons)}>
          <Button
            text="Submit from"
            isInProcess={sendFeedbackOwnerShipTicketInProcess}
            disabled={this.disabledRequest()}
            onClick={this.sendRequest}
          />
          <Button text="Clear from" borderColor="gray-3" transparent onClick={this.clear} />
        </div>
      </div>
    );
  }
}

export default connect(
  (state) => ({
    sendFeedbackOwnerShipTicketInProcess: state.FeedbackReducer.sendFeedbackOwnerShipTicketInProcess,
  }),
  (dispatch) => ({
    sendFeedbackOwnerShipTicketRequest: (params) => sendFeedbackOwnerShipTicketRequestAction(params)(dispatch),
    showPopup: (popupId, popupData = {}, closeOtherPopups = true) => {
      dispatch(showPopupAction(popupId, popupData, closeOtherPopups));
    },
  })
)(RightsholdersForm);
