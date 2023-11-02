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
import { RoutePathsConstants } from '@/constants/routes/routes';
import ScrollBlockIdConstants from '@/constants/scroll/scrollBlockId';
import { showPopupAction } from '@/redux-actions/components/popupActions';
import ScrollService from '@/services/scroll/ScrollService';
import { changeCheckBoxHandler, changeInputHandler, pressEnterKeyInputHandler, validateField } from '@/utils/inputHandlersUtil';
import { ValidateMaxLengthUtil, ValidateMinLengthUtil, ValidateRegularTestUtil } from '@/utils/validate/inputCheckValidate';

import styles from './styles.module.scss';

const initialState = {
  company: '',
  companyError: false,
  companyErrorMsg: '',

  email: '',
  emailError: false,
  emailErrorMsg: '',

  address: '',
  addressError: false,
  addressErrorMsg: '',

  phone: '',
  phoneError: false,
  phoneErrorMsg: '',

  recording: '',
  recordingError: false,
  recordingErrorMsg: '',

  artist: '',
  artistError: false,
  artistErrorMsg: '',

  composer: '',
  composerError: false,
  composerErrorMsg: '',

  label: '',
  labelError: false,
  labelErrorMsg: '',

  date: '',
  dateError: false,
  dateErrorMsg: '',

  isrc: '',
  isrcError: false,
  isrcErrorMsg: '',

  acceptRules: false,
  acceptRulesError: false,
  acceptRulesErrorMsg: '',

  agree: false,
  agreeError: false,
  agreeErrorMsg: '',

  files: [],
  filesError: false,
  filesErrorMsg: '',
};

class RightsholdersForm extends Component {
  constructor(props) {
    super(props);

    this.sectionRef = createRef();

    this.changeInputHandler = changeInputHandler.bind(this);
    this.validateField = validateField.bind(this);
    this.changeCheckBoxHandler = changeCheckBoxHandler.bind(this);

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
    const {
      email,
      emailError,

      company,
      companyError,

      address,
      addressError,

      phone,
      phoneError,

      recording,
      recordingError,

      artist,
      artistError,

      composer,
      composerError,

      label,
      labelError,

      date,
      dateError,

      isrc,
      isrcError,

      acceptRules,
      acceptRulesError,

      agree,
      agreeError,

      files,
      filesError,
    } = this.state;

    return (
      !email ||
      emailError ||
      !company ||
      companyError ||
      !address ||
      addressError ||
      !phone ||
      phoneError ||
      !recording ||
      recordingError ||
      !artist ||
      artistError ||
      !composer ||
      composerError ||
      !label ||
      labelError ||
      !date ||
      dateError ||
      !isrc ||
      isrcError ||
      !acceptRules ||
      acceptRulesError ||
      !agree ||
      agreeError ||
      files.length === 0 ||
      filesError
    );
  };

  sendRequest = () => {
    if (!this.disabledRequest()) {
      return;
    }

    console.log('sendRequest');
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
    const { files } = this.state;

    const tmpFiles = cloneDeep(files);

    const findFilesIdx = tmpFiles.findIndex((f) => f.id === id);

    tmpFiles.splice(findFilesIdx, 1);

    this.setState({
      files: tmpFiles,
    });
  };

  render() {
    const {
      email,
      emailError,
      emailErrorMsg,

      company,
      companyError,
      companyErrorMsg,

      address,
      addressError,
      addressErrorMsg,

      phone,
      phoneError,
      phoneErrorMsg,

      recording,
      recordingError,
      recordingErrorMsg,

      artist,
      artistError,
      artistErrorMsg,

      composer,
      composerError,
      composerErrorMsg,

      label,
      labelError,
      labelErrorMsg,

      date,
      dateError,
      dateErrorMsg,

      isrc,
      isrcError,
      isrcErrorMsg,

      acceptRules,
      acceptRulesError,
      acceptRulesErrorMsg,

      agree,
      agreeError,
      agreeErrorMsg,

      files,
      filesError,
      filesErrorMsg,
    } = this.state;

    return (
      <div className={classNames(styles.RightsholdersForm)} ref={this.sectionRef}>
        <RightsholdersFormGroup description="Company Information:">
          <Input
            id="company"
            label="Company Name"
            value={company}
            invalid={companyError}
            invalidMessage={companyErrorMsg}
            onChange={this.changeInputHandler}
            onBlur={(e) => {
              this.validateField(e, {
                fieldIsValid: (fieldValue) => ValidateRegularTestUtil(fieldValue, CommonRegExpConstants.NAME_VALIDATE),
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
                id: FormFieldsPersonalInformationConstants.email,
                label: 'Contact Email',
                value: email,
                invalid: emailError,
                invalidMessage: emailErrorMsg,
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
                fieldIsValid: (fieldValue) => ValidateRegularTestUtil(fieldValue, CommonRegExpConstants.NAME_VALIDATE),
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
          />
        </RightsholdersFormGroup>
        <RightsholdersFormGroup description="Recording Information:">
          <Input
            id="recording"
            label="Title of the Recording(s)"
            value={recording}
            invalid={recordingError}
            invalidMessage={recordingErrorMsg}
            onChange={this.changeInputHandler}
            onBlur={(e) => {
              this.validateField(e, {
                fieldIsValid: (fieldValue) => ValidateRegularTestUtil(fieldValue, CommonRegExpConstants.NAME_VALIDATE),
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
            id="artist"
            label="Name of the Artist(s)"
            value={artist}
            invalid={artistError}
            invalidMessage={artistErrorMsg}
            onChange={this.changeInputHandler}
            onBlur={(e) => {
              this.validateField(e, {
                fieldIsValid: (fieldValue) => ValidateRegularTestUtil(fieldValue, CommonRegExpConstants.NAME_VALIDATE),
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
            id="composer"
            label="Name of the Composer(s)"
            value={composer}
            invalid={composerError}
            invalidMessage={composerErrorMsg}
            onChange={this.changeInputHandler}
            onBlur={(e) => {
              this.validateField(e, {
                fieldIsValid: (fieldValue) => ValidateRegularTestUtil(fieldValue, CommonRegExpConstants.NAME_VALIDATE),
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
                fieldIsValid: (fieldValue) => ValidateRegularTestUtil(fieldValue, CommonRegExpConstants.NAME_VALIDATE),
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
            id="date"
            label="Date of Release"
            value={date}
            invalid={dateError}
            invalidMessage={dateErrorMsg}
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
                inputId="files"
                files={files}
                invalid={filesError}
                invalidMessage={filesErrorMsg}
                callBackUploadFiles={(filesList) => {
                  this.setState({
                    files: filesList,
                  });
                }}
              >
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label htmlFor="files" className={styles.RightsholdersForm__attachText}>
                  Attach any relevant documents that confirm your master ownership or&nbsp;license, such as&nbsp;contracts,
                  registrations, or&nbsp;other supporting material
                </label>
              </FileUploader>
            </div>
            <FileUploaderListNames
              files={files}
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
            id="acceptRules"
            checked={acceptRules}
            invalid={acceptRulesError}
            invalidMsg={acceptRulesErrorMsg}
            onChange={this.changeCheckBoxHandler}
          >
            I&nbsp;am the rightful master owner or&nbsp;licensee of&nbsp;the aforementioned recording(s)
            or&nbsp;am&nbsp;authorized to&nbsp;act on&nbsp;behalf of&nbsp;the master owner or&nbsp;licensee.
          </CheckBox>
          <CheckBox
            className={classNames(styles.RightsholdersForm__checkbox)}
            id="agree"
            checked={agree}
            invalid={agreeError}
            invalidMsg={agreeErrorMsg}
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
          <Button text="Submit from" disabled={this.disabledRequest()} onClick={this.sendRequest} />
          <Button text="Clear from" borderColor="gray-3" transparent onClick={this.clear} />
        </div>
      </div>
    );
  }
}

export default connect(
  () => ({}),
  (dispatch) => ({
    showPopup: (popupId, popupData = {}, closeOtherPopups = true) => {
      dispatch(showPopupAction(popupId, popupData, closeOtherPopups));
    },
  })
)(RightsholdersForm);
