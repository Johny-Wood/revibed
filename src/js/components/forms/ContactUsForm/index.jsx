import { Component } from 'react';

import { connect } from 'react-redux';

import AgreePrivacyPolicyCheckBox from '@/components/common-ui/check-boxes/AgreePrivacyPolicyCheckBox';
import SupportTopicSelect from '@/components/forms/ContactUsForm/_components/SupportTopicSelect';
import PersonalInformationFields from '@/components/forms/personal/profile/PersonalInformationFields';
import Button from '@/components/ui/buttons/Button';
import TextArea from '@/components/ui/inputs/TextArea';
import { CommonErrorMessages } from '@/constants/common/errorsMessage';
import { CommonMessagesConstants } from '@/constants/common/message';
import { FormFieldsPersonalInformationConstants } from '@/constants/form/fields';
import { sendFeedbackTicketRequestAction } from '@/redux-actions/feedback/feedbackActions';
import { handleErrorUtil } from '@/utils/apiUtils';
import { changeCheckBoxHandler, changeInputHandler, setInputError, validateField } from '@/utils/inputHandlersUtil';
import { ValidateBadRequestUtil, ValidateMaxLengthUtil } from '@/utils/validate/inputCheckValidate';

import styles from './styles.module.scss';

class ContactUsForm extends Component {
  constructor(props) {
    super(props);

    this.changeCheckBoxHandler = changeCheckBoxHandler.bind(this);
    this.changeInputHandler = changeInputHandler.bind(this);
    this.setInputError = setInputError.bind(this);
    this.validateField = validateField.bind(this);
    this.badRequest = ValidateBadRequestUtil.bind(this);

    const { userInfo: { email = '' } = {} } = props;

    this.state = {
      email: email || '',
      emailError: false,
      emailErrorMsg: '',

      text: '',
      textError: false,
      textErrorMsg: '',

      agrees: false,
      agreesError: false,
      agreesErrorMsg: '',

      topic: [],
      topicError: false,
      topicErrorMsg: '',
    };
  }

  sendRequest = () => {
    const { sendFeedbackTicketRequest, sendRequestCallback } = this.props;
    const { email, text, agrees, topic } = this.state;

    const { id: topicId } = topic[0] || {};

    if (this.disabledButton()) {
      return;
    }

    sendFeedbackTicketRequest({
      email,
      text,
      agrees,
      topicId,
    })
      .then(() => {
        sendRequestCallback();
      })
      .catch(({ error, payload: { errorField } = {} }) => {
        if (error) {
          handleErrorUtil(error, {
            BAD_REQUEST: () => {
              this.badRequest(errorField);
            },
            NEED_AGREEMENT: () => {
              this.setInputError('agrees', CommonErrorMessages.AGREE);
            },
          });
        }
      });
  };

  disabledButton = () => {
    const { sendFeedbackTicketInProcess } = this.props;
    const { email, emailError, text, textError, agrees, agreesError, topic, topicError } = this.state;

    return (
      sendFeedbackTicketInProcess ||
      !email ||
      !text ||
      !agrees ||
      topic.length <= 0 ||
      emailError ||
      textError ||
      agreesError ||
      topicError ||
      !ValidateMaxLengthUtil(text, CommonErrorMessages.MESSAGE_MAX_LENGTH)
    );
  };

  render() {
    const { sendFeedbackTicketInProcess, feedbackTopics } = this.props;
    const {
      agrees,
      agreesError,
      agreesErrorMsg,

      email,
      emailError,
      emailErrorMsg,

      text,
      textError,
      textErrorMsg,

      topic,
      topicError,
      topicErrorMsg,
    } = this.state;

    return (
      <div className={styles.contactUsForm}>
        <PersonalInformationFields
          onChange={this.changeInputHandler}
          validateField={this.validateField}
          request={this.sendRequest}
          fields={[
            {
              type: FormFieldsPersonalInformationConstants.email,
              id: FormFieldsPersonalInformationConstants.email,
              value: email,
              invalid: emailError,
              invalidMessage: emailErrorMsg,
            },
          ]}
        />
        <SupportTopicSelect
          items={feedbackTopics}
          selected={topic}
          changeItems={(topicItem) => {
            this.setState({
              topic: [topicItem[0]],
            });
          }}
          error={topicError}
          errorMsg={topicErrorMsg}
        />
        <TextArea
          id="text"
          placeholder="Any questions, suggestions, feedback or description of the problem with screenshots"
          value={text}
          invalid={textError}
          invalidMessage={textErrorMsg}
          onChange={this.changeInputHandler}
          onBlur={(e) => {
            this.validateField(e, {
              fieldIsValid: (value) => ValidateMaxLengthUtil(value, CommonErrorMessages.MESSAGE_MAX_LENGTH),
              invalidMessage: CommonErrorMessages.MESSAGE_MAX_LENGTH_ERROR,
              validateEmptyField: true,
            });
          }}
        />
        <AgreePrivacyPolicyCheckBox
          id="agrees"
          checked={agrees}
          error={agreesError}
          errorMsg={agreesErrorMsg}
          onChange={this.changeCheckBoxHandler}
          className="w-auto checkbox-agree"
        />
        <Button
          text={CommonMessagesConstants.SUBMIT}
          className="contact-us-form__button"
          disabled={this.disabledButton()}
          isInProcess={sendFeedbackTicketInProcess}
          onClick={this.sendRequest}
        />
      </div>
    );
  }
}

export default connect(
  (state) => ({
    feedbackTopics: state.FeedbackReducer.feedbackTopics,
    sendFeedbackTicketInProcess: state.FeedbackReducer.sendFeedbackTicketInProcess,
    userInfo: state.AuthReducer.userInfo,
  }),
  (dispatch) => ({
    sendFeedbackTicketRequest: (params) => sendFeedbackTicketRequestAction(params)(dispatch),
  })
)(ContactUsForm);
